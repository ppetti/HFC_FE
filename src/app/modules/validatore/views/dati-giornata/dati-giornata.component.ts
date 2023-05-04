import { Component, Inject, OnInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import jwt_decode from 'jwt-decode';
import { CoreApiService } from '@Src/app/core/services/core-api.service';
import { switchMap, tap } from 'rxjs/operators';
import { FormControl, FormGroup, MinLengthValidator, Validators } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidatoreApiService } from '../../services/validatore-api.service';
import { ValidatoreNavigationService } from '../../services/validatore-navigation.service';
import { number } from 'echarts';
import { LoaderService } from '@Src/app/loader/loader.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-dati-giornata',
  templateUrl: './dati-giornata.component.html',
  styleUrls: ['./dati-giornata.component.scss']
})
export class DatiGiornataComponent implements OnInit {

  userInfo: any;
  isDatiGiornalieriAlreadyPresent: boolean;
  idDatiGiornalieri: any;
  datiGiornalieri:any;
  // SearchForm: any;
  autistiList = [];
  busList = [];
  tipiTurnoList = [];

  SearchForm = new FormGroup
  ({
      autista: new FormControl(null,Validators.required),
      bus: new FormControl(null,Validators.required),
      tipoTurno: new FormControl(null,Validators.required),
  })

  constructor(
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    private navigation: ValidatoreNavigationService,
    private validatoreService: ValidatoreApiService,
    private coreService: CoreApiService,
    private _snackBar: MatSnackBar,
    private loader: LoaderService,
  ) { }

  ngOnInit(): void {

    this.coreService.whoAmI().subscribe(
      userDetail => {
        this.userInfo = userDetail;
        this.checkChiusura();
      });


  }


  checkChiusura(){
    this.loader.show();

    forkJoin([
      this.validatoreService.getAllAutisti(),
      this.validatoreService.getAllBus(),
      this.validatoreService.getAllTipiTurni(),
    ]).subscribe(
      ([autisti, bus, tipiTurni]) => {
          this.autistiList = autisti;
          this.busList = bus;
          this.tipiTurnoList = tipiTurni;
          this.loader.hide();

          this.validatoreService.checkDatiGiornalieriUtenteData(this.userInfo.id, { data: null}).subscribe(
            datiGiornalieri => {
              this.isDatiGiornalieriAlreadyPresent = false
              if(datiGiornalieri != null) {
                this.datiGiornalieri = datiGiornalieri;
                this.isDatiGiornalieriAlreadyPresent = true;
                // this.SearchForm = new FormGroup
                // ({
                //     autista: new FormControl(datiGiornalieri.autista,Validators.required),
                //     bus: new FormControl(datiGiornalieri.bus,Validators.required),
                //     tipoTurno: new FormControl(datiGiornalieri,Validators.required),
                // })
                // this.SearchForm.get('autista').disable();
                // this.SearchForm.get('bus').disable();
                // this.SearchForm.get('tipoTurno').disable();
              }
              // this.idDatiGiornalieri = this.isDatiGiornalieriAlreadyPresent ? wrapper.chiusuraId : null;
            });

      })

  }

  backToLand() {
    this.navigation.goToHome();
  }

  // downloadChiusura() {
  //   this.loader.show();
  //   this.validatoreService.getChiusuraById(this.idDatiGiornalieri).subscribe(
  //     chiusura => {
  //       let data = new Date(chiusura.data).toLocaleDateString();
  //       data = data.split('/').join('-');
  //       const linkSource = `data:application/pdf;base64,${chiusura.pdf}`;
  //       const downloadLink = document.createElement("a");
  //       const fileName = "chiusura_" + data + ".pdf";
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

  effettuaCompilazioneDati() {
    let idDistributore = this.userInfo.id;
    let wrapper = {
      autista: this.SearchForm.value.autista,
      bus: this.SearchForm.value.bus,
      tipoTurno: this.SearchForm.value.tipoTurno,
      data: null,
    }
    this.validatoreService.addDatiGiornalieriOperatore(idDistributore, wrapper).subscribe(
      res => {
        this.checkChiusura();
        this.openSnackBar(res.messaggio,'chiudi');
      }
    )
  }

  compareById( a, b ) : boolean {
    return a && b && a.id === b.id;
  }

}

