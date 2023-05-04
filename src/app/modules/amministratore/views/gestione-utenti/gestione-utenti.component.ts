import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '@Src/app/loader/loader.service';
import { ModalService } from '@Src/app/shared/services/modal.service';
import { AmministratoreApiService } from '../../services/amministratore-api.service';
import { ChiusuraService } from '../../services/chiusura.service';
import { UtenteService } from '../../services/utente.service';
import { NuovoUtenteComponent } from '../nuovo-utente/nuovo-utente.component';
import { VisualizzaChiusuraComponent } from '../visualizza-chiusura/visualizza-chiusura.component';
import { saveAs } from 'file-saver';
import { VisualizzaStoricoDatiTurniComponent } from './../visualizza-storico-dati-turni/visualizza-storico-dati-turni.component';

export interface Utente {
  id: string;
  nome: string;
  login: string;
  attivo: string;
  ruolo: any;
  telefono: string;
}

function compare(a: string, b: string, isAsc: boolean) {
  a = a.toUpperCase();
  b = b.toUpperCase();
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
@Component({
  selector: 'app-gestione-utenti',
  templateUrl: './gestione-utenti.component.html',
  styleUrls: ['./gestione-utenti.component.scss']
})
export class GestioneUtentiComponent implements AfterViewInit {

  displayedColumns: string[] = ['nome', 'login','ruolo','telefono', 'attivo', 'azioni'];
  listaUtenti: any;
  dataSource: MatTableDataSource<Utente>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private dialog: MatDialog,
    private utenteService: UtenteService,
    private _snackBar: MatSnackBar,
    private modalService: ModalService,
    private chiusuraService: ChiusuraService,
    private loader: LoaderService,
  ) { }

  ngAfterViewInit() {
    this.getUtenti();
    this.utenteService.createForm();
  }

  getUtenti() {
    this.loader.show();
    this.amministratoreService.getAllUtenti().subscribe(
      listaUtenti => {
        this.listaUtenti = listaUtenti
        this.dataSource = new MatTableDataSource(this.listaUtenti)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.sortData();
        this.filterSettings();

        this.amministratoreService.getAllDistributori().subscribe(
          distributori => {
            let listaDistributori = distributori;

            listaUtenti.forEach(el => {
              if(el.ruolo.nome_ruolo == "Rivenditore"){

                listaDistributori.forEach(distributore => {
                  if(distributore.id == el.id ){
                    el.abituale = distributore.abituale
                  }

                });

              }
              this.loader.hide();
            });

        });

    });


    // this.amministratoreService.getAllDistributori().subscribe(
    //   distributori => {
    //     let listaDistributori = distributori;

    // });

  }


  filterSettings() {
    this.dataSource.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        switch(ele) {
          case 'attivo': {
            if(data[ele]){
              return  "abilitato".toLowerCase().indexOf(filter) != -1
            }else {
              return  "bloccato".toLowerCase().indexOf(filter) != -1
            }
          }
          case 'ruolo': return data[ele] != null && data[ele].nome_ruolo != null ? data[ele].nome_ruolo.toLowerCase().indexOf(filter) != -1 : false;
          case 'azioni': return false;
          default: return data[ele] != null ?  data[ele].toLowerCase().indexOf(filter) != -1 : false;
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  sortData() {
    this.dataSource.sortData = (data, sort) => {
      return data.sort((a, b)  => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'nome': return compare(a.nome, b.nome, isAsc);
          case 'login': return compare(a.login, b.login, isAsc);
          case 'attivo': return compare(a.attivo?"abilitato":"bloccato", b.attivo?"abilitato":"bloccato", isAsc);
          case 'ruolo': return compare(a.ruolo.nome_ruolo, b.ruolo.nome_ruolo, isAsc);
          case 'telefono': return compare(a.telefono, b.telefono, isAsc);
          default: return 0;
        }
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  deleteUser(utente) {
    let message = 'Confermando l\'utente ' + utente.nome.toUpperCase() + ' verrà eliminato definitivamente dal sistema.'
    let title = 'Vuoi eliminare l\'utente?'
    this.modalService.openModal(title, message)
    .afterClosed().subscribe(res =>{
      if(res){
        switch(utente.ruolo.nome_ruolo) {
          case 'Rivenditore': {
            this.amministratoreService.removeDistributore(utente.id).subscribe(
              res => {
                this.openSnackBar(res.messaggio, 'chiudi');
                this.getUtenti();
              },
              err => console.log('err', err)
            )
            break;
          }
          case 'Amministratore': {
            this.amministratoreService.removeAmministratore(utente.id).subscribe(
              res => {
                this.openSnackBar(res.messaggio, 'chiudi');
                this.getUtenti();
              },
              err => console.log('err', err)
            )
            break;
          }
          case 'Operatore interno': {
            this.amministratoreService.removeValidatore(utente.id).subscribe(
              res => {
                this.openSnackBar(res.messaggio, 'chiudi');
                this.getUtenti();
              },
              err => console.log('err', err)
            )
            break;
          }
        }
      }
    });
  }

  resetPassword(id){
    this.amministratoreService.resetPassword(id).subscribe(
      res => {
        console.log('res', res.messaggio);
        this.openSnackBar(res.messaggio, 'chiudi');
        this.getUtenti();
      },
      err => console.log('err', err)
    )
  }

  // downloadReportFermate(id) {
  //   this.loader.show();
  //   this.amministratoreService.getPdfFermatePerValidatore(id).subscribe( blob => {
  //     let data = new Date().toLocaleDateString();
  //     data = data.split('/').join('-');
  //     // const linkSource = `data:application/pdf;base64,${byteArray}`;
  //     // const downloadLink = document.createElement("a");
  //     const fileName = "dettaglioFermate_" + data + ".pdf";
  //     // downloadLink.href = linkSource;
  //     // downloadLink.download = fileName;
  //     // downloadLink.click();
  //     saveAs(blob, fileName)
  //     this.loader.hide();
  //   },
  //   err => {
  //     this.openSnackBar("impossibile scaricare il dettaglio fermate", 'chiudi');
  //     this.loader.hide();
  //   })
  // }

  changeStato(id, stato){
    console.log('stato', stato)
    this.amministratoreService.cambiaStato(id, {"stato": stato}).subscribe(
      res => {
        console.log('res', res.messaggio);
        this.openSnackBar(res.messaggio, 'chiudi');
        this.getUtenti();
      },
      err => console.log('err', err)
    )
  }

  addUser() {
    this.utenteService.isAggiungiCredito = false;
    this.utenteService.distributore = {
          abituale: false,
          citta: '',
          creditoAggiunto: 0,
          creditoDisponibile: 0,
          creditoTotale: 0,
          indirizzo: '',
          login: '',
          nome: '',
          ruolo: {id: null, nome_ruolo: null},
          telefono: null,
          titolare: ''
    } ;
//     abituale: true
// citta: "roma"
// creditoAggiunto: 0
// creditoDisponibile: 51
// creditoTotale: 51
// indirizzo: "via antonio"
// login: "test@testcredito.it"
// nome: "gianni"
// ruolo: {id: '123e4567-e89b-12d3-a456-426614174001', nome_ruolo: 'Rivenditore'}
// telefono: "333333333"
// titolare: "test SRL
    this.utenteService.inizializeForm();
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    this.dialog.open(NuovoUtenteComponent, dialogConfig)
    .afterClosed().subscribe(
      ()=> this.getUtenti()
    );
  }

  editUser(utente, booleano) {
    this.utenteService.isAggiungiCredito = booleano;
    this.utenteService.populateForm(utente);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "40%";
    this.dialog.open(NuovoUtenteComponent, dialogConfig)
    .afterClosed().subscribe(
      ()=> this.getUtenti()
    );
  }

  visualizzaUserDatiTurno(utente, booleano) {
    this.chiusuraService.setUtente(utente);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.height = "80%";
    this.dialog.open(VisualizzaStoricoDatiTurniComponent, dialogConfig);
  }

  visualizzaChiusura(utente) {
    this.chiusuraService.setUtente(utente);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = false;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "70%";
    dialogConfig.height = "80%";
    this.dialog.open(VisualizzaChiusuraComponent, dialogConfig);
  }
}
