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
  selector: 'app-visualizza-storico-dati-turni',
  templateUrl: './visualizza-storico-dati-turni.component.html',
  styleUrls: ['./visualizza-storico-dati-turni.component.scss']
})
export class VisualizzaStoricoDatiTurniComponent implements OnInit {

  utente;
  data: any;
  isChiusuraAlreadyPresent;
  idChiusura;
  dateToDisplay: any;
  validatore = null;
  oggettoDate;
  isDistributore = false;
  datiGiornalieri;

  constructor(
    private chiusiraService: ChiusuraService,
    private datePipe: DatePipe,
    private amministratoreService: AmministratoreApiService,
    private loader: LoaderService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    this.utente = this.chiusiraService.getUtente();

  }

  OnDateChange(value) {
    this.oggettoDate = value;
    this.dateToDisplay = this.datePipe.transform(value, 'dd/MM/yyyy');
    let date = this.datePipe.transform(value, 'yyyy-MM-dd');
    this.data = {
      data: date
    }
    this.checkChiusuraUtente();
  }

  checkChiusuraUtente() {
    this.loader.show();
    this.amministratoreService.checkDatiGiornalieriUtenteData(this.utente.id, this.data).subscribe(
      datiGiornalieri => {
        if(datiGiornalieri != null){
          this.isChiusuraAlreadyPresent = true;
          this.idChiusura = datiGiornalieri.id;
          this.datiGiornalieri = datiGiornalieri;
        } else {
          this.isChiusuraAlreadyPresent = false;
          this.idChiusura = null;
        }
        // this.isChiusuraAlreadyPresent = wrapper.present;
        // this.idChiusura = this.isChiusuraAlreadyPresent ? wrapper.chiusuraId : null;
        this.loader.hide();
      })
  }

  // downloadReportFermate() {
  //   this.loader.show();
  //   this.amministratoreService.getPdfFermatePerValidatore(this.utente.id, this.data).subscribe(blob => {
  //     let dataNow = new Date().toLocaleDateString();
  //     dataNow = dataNow.split('/').join('-');
  //     const fileName = "dettaglioFermate_" + dataNow + ".pdf";

  //     saveAs(blob, fileName)
  //     this.loader.hide();
  //   },
  //     err => {
  //       this.openSnackBar("impossibile scaricare il dettaglio fermate", 'chiudi');
  //       this.loader.hide();
  //     })
  // }

  // downloadChiusura() {
  //   this.loader.show();
  //   this.validatoreService.getChiusuraById(this.idChiusura).subscribe(
  //     chiusura => {
  //       let data = new Date(chiusura.data).toLocaleDateString();
  //       data = data.split('/').join('-');
  //       const linkSource = `data:application/pdf;base64,${chiusura.pdf}`;
  //       const downloadLink = document.createElement("a");
  //       const fileName = "chiusura_" + this.utente.nome + '_' + data + ".pdf";
  //       downloadLink.href = linkSource;
  //       downloadLink.download = fileName;
  //       downloadLink.click();
  //       this.loader.hide();
  //     }
  //   )
  // }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  // effettuaChiusura() {

  //   this.loader.show();
  //   if (this.utente.ruolo.nome_ruolo == 'Rivenditore') {

  //     let wrapper = {
  //       data: this.oggettoDate
  //     }
  //     this.amministratoreService.addChiusura(this.utente.id, wrapper).subscribe(
  //       res => {
  //         this.checkChiusuraUtente();
  //         this.openSnackBar(res.messaggio, 'chiudi');
  //         this.loader.hide();
  //       },
  //       err => {
  //         this.loader.hide();
  //       }
  //     )
  //   }

  //   if (this.utente.ruolo.nome_ruolo == "Operatore interno") {
  //     let wrapper = {
  //       data: this.oggettoDate
  //     }
  //     this.amministratoreService.addChiusura(this.utente.id, wrapper).subscribe(
  //       res => {
  //         this.checkChiusuraUtente();
  //         this.openSnackBar(res.messaggio, 'chiudi');
  //         this.loader.hide();
  //       },
  //       err => {
  //         this.loader.hide();
  //       }
  //     )

  //   }
  // }


}
