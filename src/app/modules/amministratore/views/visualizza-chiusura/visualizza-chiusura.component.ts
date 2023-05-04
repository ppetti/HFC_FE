import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDatepicker } from '@angular/material/datepicker';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '@Src/app/loader/loader.service';
import { DistributoreApiService } from '@Src/app/modules/distributore/services/distributore-api.service';
import { ValidatoreApiService } from '@Src/app/modules/validatore/services/validatore-api.service';
import { AmministratoreApiService } from '../../services/amministratore-api.service';
import { ChiusuraService } from '../../services/chiusura.service';
import { saveAs } from 'file-saver';


@Component({
  selector: 'app-visualizza-chiusura',
  templateUrl: './visualizza-chiusura.component.html',
  styleUrls: ['./visualizza-chiusura.component.scss']
})
export class VisualizzaChiusuraComponent implements OnInit {

  utente;
  distributore = null;
  data: any;
  bigliettiVendutiList;
  nRidotti = 0;
  nInteri = 0;
  totRidotti = 0;
  totInteri = 0;
  totContanti = 0;
  isChiusuraAlreadyPresent;
  idChiusura;
  dateToDisplay: any;
  validatore = null;
  oggettoDate;
  totValidati: number;
  prezzoRivenditore: any;
  isDistributore = false;
  validatiPerTipologia: any[] = [];
  hasOta;

  validatiOta: any[] = [];
  distributoriOtaBackup = [];
  distributoriOta: any;
  validatiVox = [];

  constructor(
    private chiusiraService: ChiusuraService,
    private distributoreService: DistributoreApiService,
    private validatoreService: ValidatoreApiService,
    private datePipe: DatePipe,
    private amministratoreService: AmministratoreApiService,
    private loader: LoaderService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.utente = this.chiusiraService.getUtente();
    if (this.utente.ruolo.nome_ruolo == 'Rivenditore') {
      this.loader.show();
      this.distributoreService.getDistributoreById(this.utente.id).subscribe(
        dist => {
          this.distributore = dist;
          this.loader.hide();
        })
    }

    // if(this.utente.ruolo.nome_ruolo == 'Operatore interno') {
    //   this.loader.show();
    //   this.validatoreService.getValidatoreById(this.utente.id).subscribe(
    //     val => {
    //       this.validatore = val;
    //       this.loader.hide();
    //     })
    // }

  }

  OnDateChange(value) {
    this.oggettoDate = value;
    this.dateToDisplay = this.datePipe.transform(value, 'dd/MM/yyyy');
    let date = this.datePipe.transform(value, 'yyyy-MM-dd');
    this.data = {
      data: date
    }
    this.getBigliettiVenduti();
  }

  getBigliettiVenduti() {
    this.hasOta = false;
    if (this.utente.ruolo && (this.utente.ruolo.nome_ruolo == 'Rivenditore' || this.utente.ruolo.nome_ruolo == 'rivenditore' || this.utente.ruolo.nome_ruolo == 'RIVENDITORE')) {
      this.isDistributore = true;
    }
    this.loader.show();
    this.checkChiusuraUtente();
    let lista = [];
    this.amministratoreService.getBigliettiVendutiUtenteData(this.utente.id, this.data).subscribe(
      listaBiglietti => {
        this.bigliettiVendutiList = listaBiglietti;
        this.nRidotti = 0;
        this.nInteri = 0;
        this.totRidotti = 0;
        this.totInteri = 0;
        this.totContanti = 0;
        this.bigliettiVendutiList.forEach(b => {


          this.nRidotti += b.nBigliettiRidotti;
          this.nInteri += b.nBigliettiInteri;
          this.totInteri += b.totInteri;
          this.totRidotti += b.totRidotti;
          if (this.distributore === null && b.contanti) {
            this.totContanti += b.totInteri + b.totRidotti;
          }

          let isPresent = false;

          lista.forEach(el => {
            if (el.tipologiaBiglietto.id == b.tipologiaBiglietto.id) {
              isPresent = true;
              el.nBigliettiRidotti += b.nBigliettiRidotti;
              el.nBigliettiInteri += b.nBigliettiInteri;
              el.totInteri += b.totInteri;
              el.totRidotti += b.totRidotti;
            }

          });

          if (!isPresent) {
            lista.push(b);
          }

        });
        this.bigliettiVendutiList = lista;

        if (this.isDistributore) {
          this.amministratoreService.getListinoprezziByDistributore(this.utente.id).subscribe(res => {
            let prezzoTotaleRivenditore = 0;

            this.bigliettiVendutiList.forEach(bigliettoVenduto => {
              let listinoPrezzi = res.listaPrezzi;
              listinoPrezzi.forEach(elListino => {

                if (bigliettoVenduto.tipologiaBiglietto.id == elListino.tipologiaBiglietto.id) {
                  prezzoTotaleRivenditore = prezzoTotaleRivenditore + bigliettoVenduto.nBigliettiInteri * (elListino.tipologiaBiglietto.prezzo_full - elListino.sconto_adult) + bigliettoVenduto.nBigliettiRidotti * (elListino.tipologiaBiglietto.prezzo_child - elListino.sconto);
                }

              });

            });

            this.prezzoRivenditore = prezzoTotaleRivenditore;

            this.loader.hide();
          })
        }
      });
    if (!this.isDistributore) {
      // this.amministratoreService.getBigliettiValidatiUtenteData(this.utente.id, this.data).subscribe(res => {
      //   this.totValidati = res.length;
      //   this.loader.hide();
      // });
      this.validatoreService.getAllDistributoriOta().subscribe(distributoriOta =>{
        this.distributoriOtaBackup = distributoriOta;
      })

      this.amministratoreService.getBigliettiValidatiWaveUtenteData(this.utente.id, this.data).subscribe(wave =>{
        this.validatiVox = wave;
      })



      const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
        arr.reduce((groups, item) => {
          (groups[key(item)] ||= []).push(item);
          return groups;
        }, {} as Record<K, T[]>);


      this.amministratoreService.getBigliettiValidatiUtenteData(this.utente.id, this.data).subscribe(res => {
        let bigliettiArray: any[];
        this.validatiPerTipologia = [];
        bigliettiArray = res;
        this.totValidati = res.length;
        this.distributoriOta = JSON.parse(JSON.stringify(this.distributoriOtaBackup));

        this.distributoriOta.forEach(distributoreOta => {
          if(distributoreOta.listaBiglietti == undefined){
            distributoreOta.listaBiglietti = [];
          }

          bigliettiArray.forEach(biglietto => {
            if(distributoreOta.id == biglietto.distributoreOta){
              this.hasOta = true;
              let validatoOta: any = {};
              validatoOta.nAdult = biglietto.bigliettoFull ? 1 : 0;
              validatoOta.nChild = !biglietto.bigliettoFull ? 1 : 0;
              validatoOta.tipologia = biglietto.tipologiaBiglietto.titolo;
              validatoOta.idTipologia = biglietto.tipologiaBiglietto.id;
              validatoOta.prezzo_child = biglietto.tipologiaBiglietto.prezzo_child;
              validatoOta.prezzo_full = biglietto.tipologiaBiglietto.prezzo_full
              validatoOta.idOta = biglietto.distributoreOta;

              let flagPresente = false;
              if(distributoreOta.listaBiglietti.length > 0){
                distributoreOta.listaBiglietti.forEach(bigliettoInListaDistributore => {
                  if(bigliettoInListaDistributore.idTipologia == validatoOta.idTipologia){
                    bigliettoInListaDistributore.nAdult = bigliettoInListaDistributore.nAdult + validatoOta.nAdult;
                    bigliettoInListaDistributore.nChild = bigliettoInListaDistributore.nChild + validatoOta.nChild;
                    flagPresente = true;
                  }
                });
              }
              if(!flagPresente){
                distributoreOta.listaBiglietti.push(validatoOta);
              }

            }
          });

        });

        bigliettiArray = bigliettiArray.filter(biglietto => biglietto.distributoreOta == null);
        let results = groupBy(bigliettiArray, i => i.tipologiaBiglietto.id);
        Object.keys(results).forEach(key => {
          let arrayPerTipologia = results[key];
          let tipologia = arrayPerTipologia[0].tipologiaBiglietto;
          let validato: any = {};
          validato.nAdult = [...arrayPerTipologia].filter(x => x.bigliettoFull == true).length;
          validato.nChild = [...arrayPerTipologia].filter(x => x.bigliettoFull == false).length;
          validato.tipologia = tipologia.titolo;
          validato.prezzo_child = tipologia.prezzo_child;
          validato.prezzo_full = tipologia.prezzo_full

          this.validatiPerTipologia.push(validato);
        })
        console.log("🚀 ~ file: chiusura-giornaliera-val.component.ts ~ line 80 ~ ChiusuraGiornalieraValComponent ~ Object.keys ~ this.validatiPerTipologia", this.validatiPerTipologia)

        // this.distributoriOta.forEach(distributoreOta => {

        //   distributoreOta.listaBiglietti.forEach(bigliettoValidato => {

        //     .forEach(element => {

        //     });

        //   });

        // });

        // let results = groupBy(bigliettiArray, i => i.tipologiaBiglietto.id);
        // this.validatiOta = [];
        // this.validatiPerTipologia = [];
        // this.distributoriOta = [];


        //   this.distributoriOta = JSON.parse(JSON.stringify(this.distributoriOtaBackup));
        //   this.distributoriOta.forEach(el => {
        //     el.listaBiglietti = [];
        //   });

        // Object.keys(results).forEach(key => {
        //   let arrayPerTipologia = results[key];
        //   let flagAppoggio = false;

        //   arrayPerTipologia.forEach(el => {
        //     let tipologia = el.tipologiaBiglietto;
        //     // let flagAppoggioNoRepDistOta = false;

        //     if(el.distributoreOta != null){

        //       // if(!flagAppoggioNoRepDistOta){
        //       //   this.distributoriOta = JSON.parse(JSON.stringify(this.distributoriOtaBackup));
        //       //   this.distributoriOta.forEach(el => {
        //       //     el.listaBiglietti = [];
        //       //   });

        //       let validatoOta: any = {};
        //       validatoOta.nAdult = [...arrayPerTipologia].filter(x => x.bigliettoFull == true).length;
        //       validatoOta.nChild = [...arrayPerTipologia].filter(x => x.bigliettoFull == false).length;
        //       validatoOta.tipologia = tipologia.titolo;
        //       validatoOta.prezzo_child = tipologia.prezzo_child;
        //       validatoOta.prezzo_full = tipologia.prezzo_full
        //       validatoOta.idOta = el.distributoreOta;
        //       this.validatiOta.push(validatoOta);

        //       this.distributoriOta.forEach(distributore => {
        //         if(validatoOta.idOta == distributore.id && !flagAppoggio){
        //           // distributore.listaBiglietti = [];
        //           distributore.listaBiglietti.push(validatoOta);
        //           flagAppoggio = true;

        //         }
        //       });
        //       // console.log('aooooooooooooooo',this.distributoriOta)

        //     } else {



        //       if(!flagAppoggio){
        //         let validato: any = {};
        //         validato.nAdult = [...arrayPerTipologia].filter(x => x.bigliettoFull == true).length;
        //         validato.nChild = [...arrayPerTipologia].filter(x => x.bigliettoFull == false).length;
        //         validato.tipologia = tipologia.titolo;
        //         validato.prezzo_child = tipologia.prezzo_child;
        //         validato.prezzo_full = tipologia.prezzo_full
        //         this.validatiPerTipologia.push(validato);
        //         flagAppoggio = true;
        //       }


        //     }

        //   });



        // })
      });
      this.loader.hide();
    }
  }

  checkChiusuraUtente() {
    this.amministratoreService.checkChiusuraUtenteData(this.utente.id, this.data).subscribe(
      wrapper => {
        this.isChiusuraAlreadyPresent = wrapper.present;
        this.idChiusura = this.isChiusuraAlreadyPresent ? wrapper.chiusuraId : null;
      })
  }

  downloadReportFermate() {
    this.loader.show();
    this.amministratoreService.getExcelFermatePerValidatore(this.utente.id, this.data).subscribe(blob => {
      let dataNow = new Date().toLocaleDateString();
      dataNow = dataNow.split('/').join('-');
      // const linkSource = `data:application/pdf;base64,${byteArray}`;
      // const downloadLink = document.createElement("a");
      const fileName = "dettaglioFermate_" + dataNow + ".xlsx";
      // downloadLink.href = linkSource;
      // downloadLink.download = fileName;
      // downloadLink.click();
      saveAs(blob, fileName)
      this.loader.hide();
    },
      err => {
        this.openSnackBar("impossibile scaricare il dettaglio fermate", 'chiudi');
        this.loader.hide();
      })
  }

  downloadChiusura() {
    this.loader.show();
    this.validatoreService.getChiusuraById(this.idChiusura).subscribe(
      chiusura => {
        let data = new Date(chiusura.data).toLocaleDateString();
        data = data.split('/').join('-');
        const linkSource = `data:application/pdf;base64,${chiusura.pdf}`;
        const downloadLink = document.createElement("a");
        const fileName = "chiusura_" + this.utente.nome + '_' + data + ".pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        this.loader.hide();
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  effettuaChiusura() {

    this.loader.show();
    if (this.utente.ruolo.nome_ruolo == 'Rivenditore') {

      let wrapper = {
        data: this.oggettoDate
      }
      this.amministratoreService.addChiusura(this.utente.id, wrapper).subscribe(
        res => {
          this.checkChiusuraUtente();
          this.openSnackBar(res.messaggio, 'chiudi');
          this.loader.hide();
        },
        err => {
          this.loader.hide();
        }
      )
    }

    if (this.utente.ruolo.nome_ruolo == "Operatore interno") {
      let wrapper = {
        data: this.oggettoDate
      }
      this.amministratoreService.addChiusura(this.utente.id, wrapper).subscribe(
        res => {
          this.checkChiusuraUtente();
          this.openSnackBar(res.messaggio, 'chiudi');
          this.loader.hide();
        },
        err => {
          this.loader.hide();
        }
      )

    }
  }


}
