import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatAccordion } from '@angular/material/expansion';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '@Src/app/loader/loader.service';
import { ModalService } from '@Src/app/shared/services/modal.service';
import { AmministratoreApiService } from '../../services/amministratore-api.service';
import { ClienteService } from '../../services/cliente.service';
import { UtenteService } from '../../services/utente.service';
import { NuovoClienteComponent } from '../nuovo-cliente/nuovo-cliente.component';

export interface Cliente {
  id: string;
  nome: string;
  email: string;
  telefono: string;
  macrosettori: any;
}

@Component({
  selector: 'app-gestione-clienti',
  templateUrl: './gestione-clienti.component.html',
  styleUrls: ['./gestione-clienti.component.scss']
})
export class GestioneClientiComponent implements AfterViewInit {

  displayedColumns: string[] = ['nome', 'email','telefono', 'macrosettori', 'azioni'];
  listaClienti: any;
  dataSource: MatTableDataSource<Cliente>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatAccordion) accordion: MatAccordion;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private dialog: MatDialog,
    private clienteService: ClienteService,
    private _snackBar: MatSnackBar,
    private modalService: ModalService,
    private loader: LoaderService,
  ) { }

  ngAfterViewInit() {
    this.loader.show();
    this.getClienti();
    this.clienteService.createForm();
  }

  getClienti() {
    this.loader.show();
    this.amministratoreService.getAllClienti().subscribe(
      listaClienti => {
        this.listaClienti = listaClienti
        this.dataSource = new MatTableDataSource(this.listaClienti)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.filterSettings();
        this.loader.hide();
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  filterSettings() {
    this.dataSource.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        switch(ele) {
          case 'macrosettori': {
            let trovato = false;
            if(data[ele] != null){
              data[ele].forEach(macrosettore => {
                if(macrosettore.nome != null && macrosettore.nome.toLowerCase().indexOf(filter) != -1) {
                  trovato = true;
                }
              });
            }

            return trovato;
          }
          case 'azioni': return null;
          default: return data[ele] != null ?  data[ele].toLowerCase().indexOf(filter) != -1 : false;
        }
      });
    }
    this.loader.hide();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  addFornitore() {
    this.clienteService.inizializeForm();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "30%";
    this.dialog.open(NuovoClienteComponent, dialogConfig)
    .afterClosed().subscribe(
      ()=> this.getClienti()
    );

  }

  deleteFornitore(fornitore) {
    let message = 'Confermando il fornitore ' + fornitore.nome.toUpperCase() + ' verrà eliminato definitivamente dal sistema.'
    let title = 'Vuoi eliminare il fornitore?'
    this.modalService.openModal(title, message)
    .afterClosed().subscribe(res =>{
      if(res){
        this.amministratoreService.removeCliente(fornitore.id).subscribe(
              res => {
                this.openSnackBar(res.messaggio, 'chiudi');
                this.getClienti();
              },
              err => console.log('err', err)
            )
      }
    });
  }

  editFornitore(fornitore) {
    this.clienteService.populateForm(fornitore);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "30%";
    this.dialog.open(NuovoClienteComponent, dialogConfig)
    .afterClosed().subscribe(
      ()=> this.getClienti()
    );
  }


}
