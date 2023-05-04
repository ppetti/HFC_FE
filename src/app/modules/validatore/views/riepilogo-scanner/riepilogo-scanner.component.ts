import { tap, switchMap } from 'rxjs/operators';
import { Component, OnInit } from '@angular/core';
import { LoaderService } from '@Src/app/loader/loader.service';
import { ScannerService } from '../../services/scanner.service';
import { ValidatoreApiService } from '../../services/validatore-api.service';
import { ValidatoreNavigationService } from '../../services/validatore-navigation.service';
import { CoreApiService } from '@Src/app/core/services/core-api.service';
declare var BrowserPrint: any;

@Component({
  selector: 'app-riepilogo-scanner',
  templateUrl: './riepilogo-scanner.component.html',
  styleUrls: ['./riepilogo-scanner.component.scss']
})
export class RiepilogoScannerComponent implements OnInit {

  QR_KEY = "12f!8cDNqk$ID+wli^sj";
  infoQR: any;
  result: string;
  isSuccess = false;
  idBiglietto: string;
  biglietto: any;
  bigliettiWave: any [];
  subTitle: string;
  expirationDate: string;
  emissionDate: string;
  fermataNome;
  giroNome;
  hasDataScadenza;
  // 1 - applicativo, 2 - cartaceo, 3 - wave
  tipobiglietto;
  bigliettoWave: any;
  zplStrArray: String[];
  selected_device;
  devices = [];
  context;
  zplScanned;

    idValidatore: string;

  constructor(
    private scannerService: ScannerService,
    private validatoreService: ValidatoreApiService,
    private navigation: ValidatoreNavigationService,
    private loader: LoaderService,
    private coreService: CoreApiService,
  ) { }

  ngOnInit(): void {
    this.validateQR();



    let html_select = (document.getElementById("selected_device") as HTMLSelectElement);
    // let html_select_wave = (document.getElementById("selected_device_wave") as HTMLSelectElement);


    // //Get the default device from the application as a first step. Discovery takes longer to complete.
    // BrowserPrint.getDefaultDevice("printer", device => {
    //   //Add device to list of devices and to html select element
    //   alert("default defice found")
    //   this.selected_device = device;
    //   this.devices = []
    //   this.devices.push(device);
    //   let option = document.createElement("option");
    //   option.text = device.name;
    //   html_select.add(option);

    // }, function (error) {
    //   alert("Cant reach deafult printer: " + error);
    // });

    //Discover any other devices available to the application
    this.context = this;
	var that = this;
    BrowserPrint.getLocalDevices(device_list => {
      for (let i = 0; i < device_list.length; i++) {
        //Add device to list of devices and to html select element
        let device = device_list[i];
        if (!this.context.selected_device || device.uid != this.context.selected_device.uid) {
          this.context.devices.push(device);
          var option = document.createElement("option");
          option.text = device.name;
          option.value = device.uid;
          html_select.add(option);
          // html_select_wave.add(option);
        }
        if (!this.selected_device) {
          this.selected_device = device_list[0]
        }
      }
      this.loader.hide();
    }, function () {
      that.loader.hide();
      alert("Error getting local devices")
    }, "printer");

  }




  validateQR() {
    this.loader.show();
    this.infoQR = this.scannerService.getInfoQR();
    if (typeof (this.infoQR) == 'string' && this.infoQR.substring(0, 2) == 'MI') {
      // Caso stampa manuale
      this.tipobiglietto = 2;
      this.infoQR = this.infoQR.substring(2);
      this.validatoreService.getBigliettoByTicketNumber(this.infoQR).subscribe(
        biglietto => {
          this.controlliBiglietto(biglietto);
          this.loader.hide();
        }
      )
    }
    else if (typeof (this.infoQR) == 'string' && this.infoQR.substring(0, 2) != 'MI') {
      //Caso biglietto Wave
	  this.coreService.whoAmI().subscribe( utente=>{
	      this.tipobiglietto = 3;
		  this.bigliettoWave = {};
          this.bigliettoWave.timbratore = {};
          this.bigliettoWave.timbratore.id = utente.id;
		  this.bigliettoWave.linkWave = this.infoQR;
		  this.bigliettoWave.fermata = {};
	      this.bigliettoWave.fermata.nomeIdentificativo = this.scannerService.getFermata();
		  this.bigliettoWave.giro = {};
	      this.bigliettoWave.giro.nomeIdentificativo = this.scannerService.getGiro();
	      this.validatoreService.getDatiBigliettoWave(this.bigliettoWave).subscribe(
	        biglietto => {
	          biglietto.isWave = true;
	          this.controlliBigliettoWave(biglietto);
	          this.loader.hide();
	        }
	      )
	  });
    }
    else if (this.infoQR && this.infoQR.hfcKey == this.QR_KEY) {
      // Caso biglietto stampato da applicativo
      this.tipobiglietto = 1;
      this.idBiglietto = this.infoQR.idBiglietto;
      this.validatoreService.getBigliettoById(this.idBiglietto).subscribe(
        biglietto => {
          this.controlliBiglietto(biglietto);
          this.loader.hide();
        })
    }
    else {
      this.isSuccess = false;
      this.result = 'QR Code non compatibile!';
      this.subTitle = 'Il codice risulta compromesso'
      this.loader.hide();
    }
  }

controlliBigliettoWave(biglietti) {
    this.bigliettiWave = biglietti;
    //se c'e' un errore nella lista ci sara' un solo elemento con l'errore
    if (biglietti[0].hasError) {
      this.tipobiglietto = null;
      this.isSuccess = false;
      this.result = "Biglietto non valido!";
      this.subTitle = biglietti[0].errorMessage;
    }
	//se non ci sono errori in tutti i biglietti validato, dataEmissione e dataScadenza sono uguali
    else if (biglietti[0].validato == null) {
	//dato che dovro' stampare i biglietti singolarmente, torno l'ok ma poi quando stampo scarico ogni volta lo zpl corrispondente tramite l'id
      this.isSuccess = true;
      this.calculateEmissionDateWave(biglietti[0].dataEmissione);
      this.result = "Biglietto validato correttamente!";
      return;
    }
	else {
      this.calculateEmissionDateWave(biglietti[0].dataEmissione);
      this.calculateExpirationDateWave(biglietti[0].dataScadenza);
      let today = new Date();
      let dataScadenza = new Date(biglietti[0].dataScadenza);
      if (today > dataScadenza) {
        this.isSuccess = false;
        this.tipobiglietto = null;
        this.result = "Biglietto scaduto!";
        this.subTitle = 'Il biglietto è stato già utilizzato';
      } else {
        let dd = String(dataScadenza.getDate()).padStart(2, '0');
        let mm = String(dataScadenza.getMonth() + 1).padStart(2, '0');
        let yyyy = dataScadenza.getFullYear();
        let hh = dataScadenza.getHours();
        let min = dataScadenza.getMinutes();
        this.expirationDate = dd + '/' + mm + '/' + yyyy;
        this.isSuccess = true;
        this.tipobiglietto = null;
        this.result = "Biglietto già validato!";
        let hhToWrite = hh < 10 ? "0" + hh : hh;
        let minToWrite = min < 10 ? "0" + min : min;
        this.subTitle = "Sarà valido fino al " + this.expirationDate + " alle ore " + hhToWrite + ':' + minToWrite;
      }
    }

  }

  controlliBiglietto(biglietto) {
    this.biglietto = biglietto;


    this.fermataNome = this.scannerService.getFermata();
    if (this.fermataNome != null && this.fermataNome != ""){
      this.biglietto.fermataNomeIdentificativo = this.fermataNome
    }

    this.giroNome = this.scannerService.getGiro();
    if (this.giroNome != null && this.giroNome != "") {
      this.biglietto.giroNomeIdentificativo = this.giroNome
    }

    if (biglietto.hasError) {
      this.tipobiglietto = null;
      this.isSuccess = false;
      this.result = "Biglietto non valido!";
      this.subTitle = biglietto.errorMessage;
    } else if (this.biglietto.validato == null) {
      this.validaBiglietto();
    } else {
      this.calculateEmissionDate();
      this.calculateExpirationDate();
      let today = new Date();
      let dataScadenza = new Date(this.biglietto.dataScadenza);
      if (today > dataScadenza) {
        this.isSuccess = false;
        this.tipobiglietto = null;
        this.result = "Biglietto scaduto!";
        this.subTitle = 'Il biglietto è stato già utilizzato';
      } else {
        let dd = String(dataScadenza.getDate()).padStart(2, '0');
        let mm = String(dataScadenza.getMonth() + 1).padStart(2, '0');
        let yyyy = dataScadenza.getFullYear();
        let hh = dataScadenza.getHours();
        let min = dataScadenza.getMinutes();
        this.expirationDate = dd + '/' + mm + '/' + yyyy;
        this.isSuccess = true;
        this.tipobiglietto = null;
        this.result = "Biglietto già validato!";
        let hhToWrite = hh < 10 ? "0" + hh : hh;
        let minToWrite = min < 10 ? "0" + min : min;
        this.subTitle = "Sarà valido fino al " + this.expirationDate + " alle ore " + hhToWrite + ':' + minToWrite;
      }
    }

  }

  validaBiglietto() {

    if (this.tipobiglietto == 2) {
      this.validatoreService.getZplFromBigliettoId(this.biglietto.id).subscribe(
        byteArray => {
          this.zplScanned = new TextDecoder().decode(byteArray);
        }
      )
    }
//non posso piu' farlo perche' ora ho n biglietti per un unico biglietto wave, lo faccio singolarmente al momento della stampa
    /*else if (this.tipobiglietto == 3) {
      this.validatoreService.getZplFromBigliettoWave(this.biglietto.idBigliettoWave).subscribe(
        byteArray => {
          this.zplScanned = new TextDecoder().decode(byteArray);
          this.isSuccess = true;
          this.calculateEmissionDate();
          this.result = "Biglietto validato correttamente!";
          return;
        }
      )
    }*/

    this.coreService.whoAmI().pipe(
      tap(userInfo => {
        this.idValidatore = userInfo.id
      }),
      switchMap(() => this.validatoreService.validaBiglietto(this.idValidatore, this.biglietto)),
      tap(res => {
        this.isSuccess = true;
        this.result = res.messaggio;
      }),
      switchMap(() => this.validatoreService.getBigliettoById(this.biglietto.id))
    ).subscribe(
      biglietto => {
        this.biglietto = biglietto;
        this.calculateEmissionDate();
        this.calculateExpirationDate();
        this.loader.hide();
      })
  }

  backToHome() {
    this.navigation.goToHome();
  }

  calculateEmissionDate() {
    let dataEmissione = new Date(this.biglietto.dataEmissione);
    let dd = String(dataEmissione.getDate()).padStart(2, '0');
    let mm = String(dataEmissione.getMonth() + 1).padStart(2, '0');
    let yyyy = dataEmissione.getFullYear();
    this.emissionDate = dd + '/' + mm + '/' + yyyy;
  }

  calculateEmissionDateWave(dataEmissioneWave) {
    let dataEmissione = new Date(dataEmissioneWave);
    let dd = String(dataEmissione.getDate()).padStart(2, '0');
    let mm = String(dataEmissione.getMonth() + 1).padStart(2, '0');
    let yyyy = dataEmissione.getFullYear();
    this.emissionDate = dd + '/' + mm + '/' + yyyy;
  }

  calculateExpirationDateWave(dataScadenzaWave) {
    let dataScadenza = new Date(dataScadenzaWave);

    if (dataScadenza.getFullYear() === 1980) {
      this.hasDataScadenza = false;
    } else {
      this.hasDataScadenza = true;
      let dd = String(dataScadenza.getDate()).padStart(2, '0');
      let mm = String(dataScadenza.getMonth() + 1).padStart(2, '0');
      let yyyy = dataScadenza.getFullYear();
      this.expirationDate = dd + '/' + mm + '/' + yyyy;
    }
  }

  calculateExpirationDate() {
    let dataScadenza = new Date(this.biglietto.dataScadenza);

    if (dataScadenza.getFullYear() === 1980) {
      this.hasDataScadenza = false;
    } else {
      this.hasDataScadenza = true;
      let dd = String(dataScadenza.getDate()).padStart(2, '0');
      let mm = String(dataScadenza.getMonth() + 1).padStart(2, '0');
      let yyyy = dataScadenza.getFullYear();
      this.expirationDate = dd + '/' + mm + '/' + yyyy;
    }
  }

  onDeviceSelected(selected) {
    for (let i = 0; i < this.devices.length; ++i) {
      if (selected.target && selected.target.value == this.devices[i].uid) {
        this.selected_device = this.devices[i];
        return;
      }
    }
  }

  writeToSelectedPrinter() {
    let dataReplace = new Date();
    let dd = String(dataReplace.getDate()).padStart(2, '0');
    let mm = String(dataReplace.getMonth() + 1).padStart(2, '0');
    let yyyy = dataReplace.getFullYear();
    let dataReplaceString = dd + '/' + mm + '/' + yyyy;
    const regex = /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/g
    this.zplScanned = this.zplScanned.replaceAll(regex, dataReplaceString);
    console.log("🚀 ~ file: riepilogo-scanner.component.ts:356 ~ RiepilogoScannerComponent ~ writeToSelectedPrinter ~ this.zplScanned", this.zplScanned)
    this.selected_device.send(this.zplScanned, undefined, errorMessage => {
      alert("Error: " + errorMessage)
    });
  }

  writeToSelectedPrinterWave(idBigliettoWave,bigl) {
	var that = this;
  this.loader.show();
  	this.validatoreService.getZplFromBigliettoWave(idBigliettoWave).subscribe(
        byteArray => {
          that.zplScanned = new TextDecoder().decode(byteArray);
		  let dataReplace = new Date();
		  let dd = String(dataReplace.getDate()).padStart(2, '0');
		  let mm = String(dataReplace.getMonth() + 1).padStart(2, '0');
		  let yyyy = dataReplace.getFullYear();
		  let dataReplaceString = dd + '/' + mm + '/' + yyyy;
      const regex = /([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))(\/)\d{4}/g
		  that.zplScanned = this.context.zplScanned.replaceAll(regex, dataReplaceString);
		  console.log("🚀 ~ file: riepilogo-scanner.component.ts:375 ~ RiepilogoScannerComponent ~ writeToSelectedPrinterWave ~ that.zplScanned", that.zplScanned)
		  that.selected_device.send(this.zplScanned,
        success => {
          this.loader.hide();
          bigl.stampaCorretta = 1;
          bigl.stampato = true;
        },
        errorMessage => {
          this.loader.hide();
          bigl.stampaCorretta = 2;
          bigl.stampato = true;
        });
     });
  }

  onClickScan() {
    this.navigation.goToScanner();
  }
}
