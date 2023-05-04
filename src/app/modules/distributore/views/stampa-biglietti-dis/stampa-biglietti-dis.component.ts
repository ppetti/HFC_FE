import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '@Src/app/loader/loader.service';
import { CarrelloService } from '../../../../shared/services/carrello.service';
import { DistributoreApiService } from '../../services/distributore-api.service';
import { DistributoreNavigationService } from '../../services/distributore-navigation.service';
import { ModalService } from './../../../../shared/services/modal.service';
declare var BrowserPrint: any;

@Component({
  selector: 'app-stampa-biglietti-dis',
  templateUrl: './stampa-biglietti-dis.component.html',
  styleUrls: ['./stampa-biglietti-dis.component.scss']
})
export class StampaBigliettiDisComponent implements OnInit {

  byteArray: any;
  zplStr: string;
  selected_device;
  devices = [];
  bigliettiSelezionati = [];
  context;

  localDevicesRecuperati = false;
  comunicazioneLocalDevice = false;
  zplStrArray: String[];

  constructor(
    private distributoreService: DistributoreApiService,
    private navigation: DistributoreNavigationService,
    private carrelloService: CarrelloService,
    private loader: LoaderService,
    private modalService: ModalService,
    private _snackBar: MatSnackBar,
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

  // ngOnInit(): void {       OLD
  //   //dal carrello service è possibile prendere i biglietti acquistati
  //   //per ognuno di quelli è da prendere lo zpl e stamparlo
  //   this.loader.show();
  //   this.bigliettiSelezionati = this.carrelloService.getBigliettiSelezionati();

  //   this.distributoreService.getZplFromBigliettoId('2e20332e-666d-41f0-bbcb-30ecae724f92').subscribe(
  //     byteArray => {
  //       this.zplStr = new TextDecoder().decode(byteArray);
  //       this.loader.hide();
  //     }
  //   )


  // //Get the default device from the application as a first step. Discovery takes longer to complete.
	// BrowserPrint.getDefaultDevice("printer", device =>
  // {
  //   //Add device to list of devices and to html select element
  //   this.selected_device = device;
  //   this.devices = []
  //   this.devices.push(device);
  //   let html_select = (document.getElementById("selected_device") as HTMLSelectElement);
  //   let option = document.createElement("option");
  //   option.text = device.name;
  //   html_select.add(option);

  //   //Discover any other devices available to the application
  //   this.context = this;
  //   BrowserPrint.getLocalDevices(device_list => {
  //     for(let i = 0; i < device_list.length; i++)
  //     {
  //       //Add device to list of devices and to html select element
  //       let device = device_list[i];
  //       if(!this.context.selected_device || device.uid != this.context.selected_device.uid)
  //       {
  //         this.context.devices.push(device);
  //         var option = document.createElement("option");
  //         option.text = device.name;
  //         option.value = device.uid;
  //         html_select.add(option);
  //       }
  //     }

  //   }, function () { console.log("Error getting local devices")},"printer"
  //   );

  // }, function(error){
  //   console.log("Nessuna stampante collegata");
  //   // alert(error);
  // })
  // }

  // onDeviceSelected(selected) {                       OLD
  //   for(let i = 0; i < this.devices.length; ++i){
  //     if(selected.value == this.devices[i].uid)
  //     {
  //       this.selected_device = this.devices[i];
  //       return;
  //     }
  //   }
  // }

  // writeToSelectedPrinter() {                           OLD
	//   this.selected_device.send(this.zplStr, undefined, errorMessage => {
  //     console.log("Error: " + errorMessage)
  //   });
  // }



  backToHome() {
    this.navigation.goToSelezionaCliente();
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
    this.distributoreService.getZplFromBigliettoId(biglietto.id).subscribe(
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
      this.distributoreService.getZplFromBigliettoId(x.id).subscribe(
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

  openSnackBar(message: string, action: string, timer) {
    this._snackBar.open(message, action, {
      duration: timer,
    });
  }


}
