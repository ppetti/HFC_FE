import { Component, Inject, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { BarcodeFormat } from '@zxing/library';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { BehaviorSubject, forkJoin } from 'rxjs';
import { ScannerService } from '../../services/scanner.service';
import { ValidatoreApiService } from '../../services/validatore-api.service';
import { ValidatoreNavigationService } from '../../services/validatore-navigation.service';

@Component({
  selector: 'app-scanner',
  templateUrl: './scanner.component.html',
  styleUrls: ['./scanner.component.scss']
})
export class ScannerComponent implements OnInit {
currentDevice = null;
formatsEnabled = [
  BarcodeFormat.CODE_128,
  BarcodeFormat.DATA_MATRIX,
  BarcodeFormat.EAN_13,
  BarcodeFormat.QR_CODE,
];
torchEnabled = false;
torchAvailable$ = new BehaviorSubject(false);
tryHarder = false;
  qrResultString: any;
  availableDevices: any;
  hasDevices: boolean;
  private _dialog: any;
  hasPermission: any;
  fermateList;
  fermataSelezionata;
  giriList;
  giroSelezionato;

  constructor(
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    private navigation: ValidatoreNavigationService,
    private scannerService: ScannerService,
    private validatoreService: ValidatoreApiService,
    private _snackBar: MatSnackBar
  ) { }

  // ngOnInit(): void {
  // }

  //INIT E TEST QRCODE SONO COSE DA SCOMMENTARE IN LOCALE PER TESTARE

  ngOnInit(): void {
    //solo test, rimuovere
    // let code = "FDOMDOFDOFS";
    // this.testQrCode(code);
    forkJoin([
      this.validatoreService.getAllFermate(),
       this.validatoreService.getAllGiri()
    ]).subscribe(
      ([fermate, giri]) => {
        this.fermateList = fermate;
        if (this.locStorage.get('fermataSelezionata')) {
          this.fermataSelezionata = [...fermate].filter(x => this.locStorage.get('fermataSelezionata') === x.nomeIdentificativo)[0];
        }

        this.giriList = giri;
        if (this.locStorage.get('giroSelezionato')) {
          this.giroSelezionato = [...giri].filter(x => this.locStorage.get('giroSelezionato') === x.nomeIdentificativo)[0];
        }

      })

    // this.validatoreService.getAllFermate().subscribe(fermate => {
    //   this.fermateList = fermate;
    //   if (this.locStorage.get('fermataSelezionata')) {
    //     this.fermataSelezionata = [...fermate].filter(x => this.locStorage.get('fermataSelezionata') === x.nomeIdentificativo)[0];
    //   }
    //   console.log("🚀 ~ file: scanner.component.ts ~ line 61 ~ ScannerComponent ~ this.validatoreService.getAllFermate ~ this.fermateList", this.fermateList)
    // })

    }

    testQrCode(url){
      this.scannerService.setInfoQR(url)
       this.navigation.goToScannerResult();
    }

  compareById(a, b): boolean {
    return a && b && a.nomeIdentificativo === b.nomeIdentificativo;
  }

  selezioneFermata(e) {
    this.locStorage.set("fermataSelezionata", e.value.nomeIdentificativo)
  }

  selezioneGiro(e) {
    this.locStorage.set("giroSelezionato", e.value.nomeIdentificativo)
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  onSuccess(value) {
    // //Controllo quale QRCODE è stato rilevato:
    // if (value.substring(0, 2) == "MI") {
    //   // QRCODE Inserimento Manuale
    //   this.scannerService.setInfoQR(value.substring(2));
    // } else if (value.substring(0, 5) == "https") {
    //   // QRCODE Wave
    //   this.scannerService.setInfoQR(value)
    // }
    // else
    if (this.locStorage.get("fermataSelezionata")) {
      this.scannerService.setFermata(this.locStorage.get("fermataSelezionata"));
    } else {
      this.scannerService.setFermata("");
    }

    if (this.locStorage.get("giroSelezionato")) {
      this.scannerService.setGiro(this.locStorage.get("giroSelezionato"));
    } else {
      this.scannerService.setGiro("");
    }

    if (value.substring(0, 1) == "{") {
      // QRCODE interno con informazioni json
      let qrInfo = JSON.parse(value);
      this.scannerService.setInfoQR(qrInfo);
    } else {
      this.scannerService.setInfoQR(value)
    }

    this.navigation.goToScannerResult();
  }

  backToHome() {
    this.navigation.goToHome();
  }

  camerasNotFoundHandler(value) {
    this.openSnackBar('Non è stata rilevata alcuna fotocamera', 'chiudi');
  }

  scanErrorHandler(value) {
    this.openSnackBar('Errore non previsto! Prova di nuovo', 'chiudi');
  }



  clearResult() {
    this.qrResultString = null;
  }
  onCamerasFound(devices) {
    this.availableDevices = devices;
    this.hasDevices = Boolean(devices && devices.length);
  }
  onCodeResult(resultString) {
    console.log("🚀 ~ file: scanner.component.ts ~ line 73 ~ ScannerComponent ~ onCodeResult ~ resultString", resultString)
    this.qrResultString = resultString;
  }
  onDeviceSelectChange(selected) {
    const device = this.availableDevices.find(x => x.deviceId === selected);
    this.currentDevice = device || null;
  }

  onHasPermission(has) {
    this.hasPermission = has;
  }

  onTorchCompatible(isCompatible) {
    this.torchAvailable$.next(isCompatible || false);
  }
  toggleTorch() {
    this.torchEnabled = !this.torchEnabled;
  }
  toggleTryHarder() {
    this.tryHarder = !this.tryHarder;
  }

}
function FormatsDialogComponent(FormatsDialogComponent: any, arg1: { data: { formatsEnabled: BarcodeFormat[]; }; }) {
  throw new Error('Function not implemented.');
}

