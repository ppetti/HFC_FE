import { forkJoin } from 'rxjs';
import { AmministratoreApiService } from './../../../services/amministratore-api.service';
import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatSelectionList } from '@angular/material/list';
import { ListinoPrezziWrapper } from '@Src/app/core/models/listino-prezzi';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '@Src/app/loader/loader.service';

@Component({
  selector: 'app-genera-listino',
  templateUrl: './genera-listino.component.html',
  styleUrls: ['./genera-listino.component.scss']
})
export class GeneraListinoComponent implements OnInit, AfterViewInit {

  listaDistributori: any[];
  listaDistributoriConListino: any[] = [];
  listaDistributoriConListinoCopy: any[];
  listaDistributoriSenzaListino: any[] = [];
  listaDistributoriSenzaListinoCopy: any[];
  distributoreToModifyList;
  distributoreToModify;
  listinoToModify;
  inputMode: string = 'edit';
  listaTipologie: any[];
  listinoPrezziToGenerate: ListinoPrezziWrapper[] = [];
  displayedColumns: string[] = ['titolo', 'prezzoF','scontoF','prezzoC', 'sconto', 'prezzoFS', 'prezzoCS'];
  nome: any;

  @ViewChild('distributoriEdit') distributoriEditSelect: MatSelectionList;
  @ViewChild('distributoriAdd') distributoriAddSelect: MatSelectionList;

  constructor(
    private apiService: AmministratoreApiService,
    private _snackBar: MatSnackBar,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.getListaDistributori();
  }

  ngAfterViewInit(): void {

    this.apiService.getTipologieBigliettoNoGruppi().subscribe(
      tipologie => {
        //console.log(tipologie, 'tipologie')
        this.listaTipologie = tipologie;
        this.loader.hide();
        // this.listaTipologie.map(el => {
          // el.sconto = parseFloat('0').toFixed(2);
          // el.sconto_adult = parseFloat('0').toFixed(2);
        // })
        this.aggiornaSconti();
        this.aggiornaScontiAdult();
      },
      err => {
        this.loader.hide();
      }
    )
  }

  getListaDistributori() {
    this.loader.show();
    this.listaDistributoriConListino=[];
    this.listaDistributoriSenzaListino=[];
    this.apiService.getAllDistributori().subscribe(
      distributori => {
        this.listaDistributori = distributori;
        this.listaDistributori.map(x => {
          if (x.haListino) {
            this.listaDistributoriConListino.push(x);
          } else {
            this.listaDistributoriSenzaListino.push(x);
          }
        })
        this.listaDistributoriSenzaListinoCopy = this.listaDistributoriSenzaListino;
        this.listaDistributoriConListinoCopy = this.listaDistributoriConListino;
        this.loader.hide();
      },
      err => {
        this.loader.hide();
      }
    )
  }

  aggiornaSconti() {
    this.listaTipologie.map(el => {
      //console.log(el.prezzoChildScontato,  el.prezzo_child, el.sconto)
      el.prezzoChildScontato = el.prezzo_child - el.sconto;
    })
  }

  aggiornaScontiAdult() {
    this.listaTipologie.map(el => {

      //console.log(el.prezzoFullScontato,  el.prezzo_full, el.sconto_adult)
      el.prezzoFullScontato = el.prezzo_full - el.sconto_adult;
      console.log(el)
      //console.log(el.prezzoFullScontato,  el.prezzo_full, el.sconto_adult)
    })
  }

  salvaListino() {
    if(this.inputMode == 'add') {
      this.generaListino();
    } else if(this.inputMode == 'edit') {
      this.modificaListino();
    }
  }

  generaListino() {
    this.listinoPrezziToGenerate = [];
    this.distributoriAddSelect.selectedOptions.selected.forEach( disSelected => {
      this.listinoPrezziToGenerate.push(
        {
          distributore: disSelected.value,
          tipologiaBiglietto: this.listaTipologie
        }
      )
    })

    this.apiService.generaListinoPrezzi(this.listinoPrezziToGenerate).subscribe(res => {
      console.log('Response: ', res);
      this.getListaDistributori();
      this.openSnackBar(res.messaggio, 'chiudi');
    })
    this.inputMode = 'edit';
  }

  modificaListino() {
    this.loader.show();
    this.apiService.modificaListinoPrezzi(this.distributoreToModify.id, this.listaTipologie).subscribe(res => {
    this.loader.hide();
    console.log("🚀 ~ file: genera-listino.component.ts ~ line 111 ~ GeneraListinoComponent ~ this.apiService.modificaListinoPrezzi ~ res", res)
    })
  }

  selectMode(mode) {
    this.inputMode = mode;
    if(mode === 'add') {
      this.listaTipologie.map(tipo => {
        tipo.sconto = parseFloat('0').toFixed(2);
        tipo.sconto_adult = parseFloat('0').toFixed(2);
      });
      this.distributoreToModifyList = null;
      this.distributoreToModify = null;
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  distributoreModificaChanged(distributore) {
    this.loader.show();
    this.distributoreToModify = this.distributoreToModifyList[0];
    this.apiService.getListinoprezziByDistributore(this.distributoreToModify.id).subscribe(
      listino => {
        this.listinoToModify = listino;
        this.listaTipologie.map( tipologia => {
          this.listinoToModify.listaPrezzi.forEach(prezzo => {
            tipologia.id === prezzo.tipologiaBiglietto.id ? tipologia.sconto = prezzo.sconto : null;
            tipologia.id === prezzo.tipologiaBiglietto.id ? tipologia.sconto_adult = prezzo.sconto_adult : null;
          });
        })
        this.aggiornaSconti();
        this.aggiornaScontiAdult();
        this.loader.hide();
      }
    )
  }

  selectAll() {
    this.distributoriAddSelect.selectAll();
  }

  deselectAll() {
    this.distributoriAddSelect.deselectAll();
  }

  assignCopy(){
    this.listaDistributoriSenzaListino = Object.assign([], this.listaDistributoriSenzaListinoCopy);
    this.listaDistributoriConListino = Object.assign([], this.listaDistributoriConListinoCopy);
  }

  filterItem(value){
    if(!value){
        this.assignCopy();
    } else if(this.inputMode === 'add') {
      this.listaDistributoriSenzaListino = Object.assign([], this.listaDistributoriSenzaListinoCopy).filter(
        item => item.utente.nome.toLowerCase().indexOf(value.toLowerCase()) > -1
     )
    } else {
      this.listaDistributoriConListino = Object.assign([], this.listaDistributoriConListinoCopy).filter(
        item => item.utente.nome.toLowerCase().indexOf(value.toLowerCase()) > -1
     )
    }

  }

  clearInput() {
    this.nome = '';
    this.filterItem('');
  }

}
