import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '@Src/app/loader/loader.service';
import { ModalService } from '@Src/app/shared/services/modal.service';
import { CarrelloService } from '../../../../shared/services/carrello.service';
import { ValidatoreApiService } from '../../services/validatore-api.service';
import { ValidatoreNavigationService } from '../../services/validatore-navigation.service';
declare var BrowserPrint: any;

@Component({
  selector: 'app-stampa-biglietti-val',
  templateUrl: './stampa-biglietti-val.component.html',
  styleUrls: ['./stampa-biglietti-val.component.scss']
})
export class StampaBigliettiValComponent implements OnInit {

  byteArray: any;
  zplStrArray: String[];
  selected_device;
  devices = [];
  bigliettiSelezionati = [];
  context;
  localDevicesRecuperati = false;
  comunicazioneLocalDevice = false;

  constructor(
    private validatoreService: ValidatoreApiService,
    private navigation: ValidatoreNavigationService,
    private carrelloService: CarrelloService,
    private loader: LoaderService,
    private modalService: ModalService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.localDevicesRecuperati = false;
    this.comunicazioneLocalDevice = false;
    this.zplStrArray = [];
    this.bigliettiSelezionati = this.carrelloService.getBigliettiSelezionati();
    if (!this.bigliettiSelezionati) {
      this.backToHome();
    } else {
      this.effettuaRicercaLocalDevice();
      this.bigliettiSelezionati.forEach(x => {
        x.stampato = false;
        // 1 è sì, 2 è no
        x.stampaCorretta = 0;
      });
    }
  }

  openSnackBar(message: string, action: string, timer) {
    this._snackBar.open(message, action, {
      duration: timer,
    });
  }

  effettuaStampa(biglietto) {
    if (biglietto.stampato && biglietto.stampaCorretta == 1) {
      let message = 'Questo biglietto risulta correttamente stampato. Effettuare una nuova stampa?';
      let title = 'Confermi l\'operazione?';
      this.modalService.openModal(title, message)
        .afterClosed().subscribe(res => {
          if (res) {
            this.stampaBiglietto(biglietto);
          }
        })
    } else {
      this.stampaBiglietto(biglietto);
    }
  }

  stampaBiglietto(biglietto) {
    biglietto.stampato = true;
    this.loader.show();
    this.validatoreService.getZplFromBigliettoId(biglietto.id).subscribe(
      byteArray => {
        let zplStr = new TextDecoder().decode(byteArray);
        this.selected_device.send(zplStr,
        success => {
          this.loader.hide();
          biglietto.stampaCorretta = 1;
        },
        errorMessage => {
          this.loader.hide();
          biglietto.stampaCorretta = 2;
        });
      }
    );
    setTimeout(() => {
      this.loader.hide();
    }, 5000)
  }

  effettuaRicercaLocalDevice() {
    this.comunicazioneLocalDevice = false;
    this.loader.show();
    this.context = this;
    let html_select = (document.getElementById("selected_device") as HTMLSelectElement);

    BrowserPrint.getLocalDevices(device_list => {
      this.comunicazioneLocalDevice = true;
      this.localDevicesRecuperati = true;
      for (let i = 0; i < device_list.length; i++) {
        //Add device to list of devices and to html select element
        let device = device_list[i];
        if (!this.context.selected_device || device.uid != this.context.selected_device.uid) {
          this.context.devices.push(device);
          var option = document.createElement("option");
          option.text = device.name;
          option.value = device.uid;
          html_select.add(option);
        }
        if (!this.selected_device) {
          this.selected_device = device_list[0]
        }
      }
      this.loader.hide();
    }, err => {
      if (!this.comunicazioneLocalDevice) {
        this.comunicaErroreLocalDevice();
      }
    }, "printer");

    setTimeout(() => {
      if (!this.comunicazioneLocalDevice) {
        this.comunicaErroreLocalDevice();
      }
    }, 20000)
  }

  comunicaErroreLocalDevice() {
    this.loader.hide();
    this.openSnackBar("Impossibile ottenere i dati della stampante, assicurarsi che BrowserPrint sia avviato sul dispositivo e riprovare.", "Chiudi", 5000);
    this.comunicazioneLocalDevice = true;
  }

  onDeviceSelected(selected) {
    for (let i = 0; i < this.devices.length; ++i) {
      if (selected.target && selected.target.value == this.devices[i].name) {
        this.selected_device = this.devices[i];
        return;
      }
    }
  }

  writeToSelectedPrinter() {
    this.loader.show();
    this.bigliettiSelezionati.forEach(x => {
      this.validatoreService.getZplFromBigliettoId(x.id).subscribe(
        byteArray => {
          let zplStr = new TextDecoder().decode(byteArray);
          this.selected_device.send(zplStr, success => {
            this.loader.hide();
          }, errorMessage => {
            this.loader.hide();
            alert("Error: " + errorMessage)
          });
        }
      )
    })



  }



  backToHome() {
    this.navigation.goToHome();
  }

  // getConfig(){
  //   BrowserPrint.getProperties( prop => {
  //     console.log(JSON.stringify(prop))
  //   })

  //   BrowserPrint.getApplicationConfiguration(function(config){
  //     console.log(JSON.stringify(config))
  //   }, function(error){
  //     console.log(JSON.stringify(new BrowserPrint.ApplicationConfiguration()));
  //   })
  // }

}
