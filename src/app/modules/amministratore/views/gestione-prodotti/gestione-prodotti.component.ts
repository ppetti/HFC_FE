import { animate, state, style, transition, trigger } from '@angular/animations';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { ModalService } from '@Src/app/shared/services/modal.service';
import { forkJoin } from 'rxjs';
import { AmministartoreNavigationService } from '../../services/amministratore-navigation.service';
import { AmministratoreApiService } from '../../services/amministratore-api.service';
import { TipologiaBigliettoService } from '../../services/tipologia-biglietto.service';
import { TipologiaBigliettoComponent } from '../tipologia-biglietto/tipologia-biglietto.component';
import { LoaderService } from './../../../../loader/loader.service';

export interface TipologieBiglietto {
  id: string;
  titolo: string;
  prezzo_child: number;
  prezzo_full: number;
  duarata: string;
  descrizione: string;
  macrosettore: any;
}

@Component({
  selector: 'app-gestione-prodotti',
  templateUrl: './gestione-prodotti.component.html',
  styleUrls: ['./gestione-prodotti.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({height: '0px', minHeight: '0'})),
      state('expanded', style({height: '*'})),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class GestioneProdottiComponent implements AfterViewInit {

  dataSource;
  //columnsToDisplay = ['titolo', 'clienti','macrosettore', 'prezzo_child', 'prezzo_full', 'durata'];
  columnsToDisplay = ['titolo','macrosettore', 'prezzo_child', 'prezzo_full', 'durata'];
  expandedElement: TipologieBiglietto | null;
  listaTipoBiglietti: TipologieBiglietto[];
  macrosettoriList: any;
  clientiList: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private modalService: ModalService,
    private _snackBar: MatSnackBar,
    private navigation : AmministartoreNavigationService,
    private tipoBigliettoService: TipologiaBigliettoService,
    private dialog: MatDialog,
    private loader: LoaderService
  ) { }

  ngAfterViewInit(): void {
    this.loader.show();
    this.tipoBigliettoService.createForm();
    this.getTipoBiglietti();
    forkJoin([
      this.amministratoreService.getAllMacrosettori(),
      this.amministratoreService.getAllClienti()
    ]).subscribe(
      ([macrosettori, clienti]) => {
        this.macrosettoriList = macrosettori,
        this.clientiList = clienti
      }
    )
  }


  filterSettings() {
    this.dataSource.filterPredicate = (data, filter) => {
      return this.columnsToDisplay.some(ele => {
        switch(ele) {
          case 'clienti': {
            let trovato = false;
            data.macrosettore[ele].forEach(cliente => {
              if(cliente.nome.toLowerCase().indexOf(filter) != -1) {
                trovato = true;
              }
            });
            return trovato;
          }
          case 'macrosettore': return data[ele] != null && data[ele].nome != null ? data[ele].nome.toLowerCase().indexOf(filter) != -1 : false;
          case 'prezzo_child': return null;
          case 'prezzo_full': return null;
          case 'durata': return null;
          default: return data[ele] != null ?  data[ele].toLowerCase().indexOf(filter) != -1 : false;
        }
      });
    }
  }

  getTipoBiglietti() {
    this.loader.show();
    this.amministratoreService.getAllTipologieBiglietto().subscribe(
      biglietti => {
        console.log(biglietti);
        this.listaTipoBiglietti = biglietti;
        this.dataSource = new MatTableDataSource<TipologieBiglietto>(this.listaTipoBiglietti);
        this.dataSource.sort = this.sort;
        this.dataSource.paginator = this.paginator;
        this.filterSettings();
        this.loader.hide();
      }
    )
  }

  applyFilter(event: any) {
    let filterValue = '';
    if(event){
      if(event.target) {
        filterValue = (event.target as HTMLInputElement).value;
      } else{
        filterValue = event
      }
      this.dataSource.filter = filterValue.trim().toLowerCase();
    } else {
      this.dataSource.filter = "";
      }
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  deleteTipologia(tipoBiglietto) {
    console.log(tipoBiglietto)
    let message = 'Confermando la tipologia di biglietto ' + tipoBiglietto.titolo.toUpperCase() + ' verrà eliminato definitivamente dal sistema.'
    let title = 'Vuoi eliminare la tipologia di biglietto?'
    this.modalService.openModal(title, message)
    .afterClosed().subscribe(res =>{
      if(res){
        // this.amministratoreService.removeTipologiaBiglietto(tipoBiglietto.id).subscribe(
        //       res => {
        //         this.openSnackBar(res.messaggio, 'chiudi');
        //         this.getTipoBiglietti();
        //       },
        //       err => console.log('err', err)
        //     )
        tipoBiglietto.eliminato = true;
        this.amministratoreService.updateTipologiaBiglietto(tipoBiglietto.id, tipoBiglietto).subscribe(
          res => {
            this.openSnackBar(res.messaggio, 'chiudi');
            this.getTipoBiglietti();
          },
          err => console.log('err', err)
        )
      }
    });
  }

  addTipologia() {
    this.tipoBigliettoService.inizializeForm();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    this.dialog.open(TipologiaBigliettoComponent, dialogConfig)
    .afterClosed().subscribe(
      ()=> this.getTipoBiglietti()
    );
  }

  updateTipologia(tipologiaBiglietto) {
    this.tipoBigliettoService.populateForm(tipologiaBiglietto);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    this.dialog.open(TipologiaBigliettoComponent, dialogConfig)
    .afterClosed().subscribe(
      ()=> this.getTipoBiglietti()
    );
  }

}
