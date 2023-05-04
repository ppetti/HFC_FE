import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoreApiService } from '@Src/app/core/services/core-api.service';
import { ModalService } from '@Src/app/shared/services/modal.service';
import { forkJoin, Observable } from 'rxjs';
import { CarrelloService } from '../../../../shared/services/carrello.service';
import { ValidatoreApiService } from '../../services/validatore-api.service';
import { ValidatoreNavigationService } from '../../services/validatore-navigation.service';
import * as i18nIsoCountries from 'i18n-iso-countries';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';
import { LoaderService } from '@Src/app/loader/loader.service';
import { formatDate } from '@angular/common';
import { Util } from '@Src/app/shared/util';

declare const require;

@Component({
  selector: 'app-riepilogo-val',
  templateUrl: './riepilogo-val.component.html',
  styleUrls: ['./riepilogo-val.component.scss']
})
export class RiepilogoValComponent implements OnInit {

  prezzoRivenditore: number;
  prezzoCliente: number;
  margine: number;
  carrello: any[];
  nAdulti: number = 0;
  nRidotti: number = 0;
  bigliettiSelezionati: any[];
  idValidatore: string;
  bigliettiVendutiList= [];
  wrapperBigliettoList = [];
  paymentMethod: any = null;
  fermateList: any[] = [];
  giriList: any[] = [];

  //listaNazioni = [];
  listaNazioni: string[] = ["ITALIA","REGNO UNITO","FRANCIA","GERMANIA","SPAGNA","PORTOGALLO","GIAPPONE","RUSSIA","ALTRO",];

  tipoGruppoList = []

  filteredOptions: Observable<string[]>;

  isGruppoSpeciale: boolean;

  SearchForm = new FormGroup
    ({
    nazione: new FormControl(''),
    tipoGruppo: new FormControl(null),
    personeGruppo: new FormControl('',[Validators.required,]),
    nomeGruppo: new FormControl('',Validators.required,),
    prezzo: new FormControl(0,Validators.required,),
    fermata: new FormControl(),
    giro: new FormControl()
    });

  constructor(
    private navigation: ValidatoreNavigationService,
    private carrelloService: CarrelloService,
    private validatoreService: ValidatoreApiService,
    private _snackBar: MatSnackBar,
    private coreService: CoreApiService,
    private modalService: ModalService,
    private loader: LoaderService,
    private util: Util,
  ) {
    carrelloService.getCarrello().subscribe(
      oggettiCarrello => {
        this.carrello = oggettiCarrello;
      }
    );
    carrelloService.getCarrelloItems();
    this.bigliettiSelezionati = carrelloService.getBigliettiSelezionati();
    console.log('bigliettiSelezionati', this.bigliettiSelezionati)
    console.log('carrello', this.carrello)
   }

  ngOnInit(): void {
    this.loader.show();
    this.getPrezzi();
    this.getNTipologie();

    this.isGruppoSpeciale = this.carrello[0].macrosettore.gruppoSpeciale;

    this.SearchForm = this.isGruppoSpeciale ? new FormGroup
    ({
        nazione: new FormControl(''),
        personeGruppo: new FormControl(null,[Validators.required,]),
        nomeGruppo: new FormControl('',Validators.required,),
        prezzo: new FormControl(0,Validators.required,),
    }) : new FormGroup
    ({
        nazione: new FormControl(''),
        tipoGruppo: new FormControl(null),
        fermata: new FormControl(null),
        giro: new FormControl(null)
    })
    console.log(this.SearchForm.valid,this.paymentMethod)

    this.coreService.whoAmI().subscribe(
      userInfo => this.idValidatore = userInfo.id

    )

    forkJoin([
      this.validatoreService.getAllGruppi(),
      this.validatoreService.getAllFermate(),
      this.validatoreService.getAllGiri()
    ]).subscribe(
      ([gruppo, fermate, giri]) => {
        this.fermateList = fermate.sort((a, b) => {
          const nameA = a.numerazione;
          const nameB = b.numerazione;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });;

        this.giriList = giri.sort((a, b) => {
          const nameA = a.numerazione;
          const nameB = b.numerazione;
          if (nameA < nameB) {
            return -1;
          }
          if (nameA > nameB) {
            return 1;
          }
          return 0;
        });;
        this.tipoGruppoList = gruppo;
        this.loader.hide();
    });

  }

  getPrezzi(){
    this.prezzoRivenditore = this.carrelloService.getPrezzoRivenditore();
    this.prezzoCliente = this.carrelloService.getPrezzoCliente();
    this.margine = (this.prezzoCliente - this.prezzoRivenditore)
  }

  getNTipologie() {
    console.log(this.carrello)
    this.carrello.forEach(tipologia => {
      this.nAdulti += tipologia.buyCountAdult;
      this.nRidotti += tipologia.buyCountChild;
    });
  }

  navigate() {
    this.navigation.goToSelezionaCliente();
  }

  backToCarrello() {
    this.navigation.goToCarrello();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  acquista() {
    let message = 'Prima di confermare assicurati di aver già ricevuto il pagamento.';
    let title = 'Confermi l\'operazione?';
    this.modalService.openModal(title, message)
    .afterClosed().subscribe(res =>{
      if(res) {
        this.loader.show();
        let isContanti = this.paymentMethod === 'cash' ? true : false;
        let isEvento = this.paymentMethod === 'no' ? true : false;
        let validatore = {
          "id" : this.idValidatore
        }
        this.carrello.forEach(x => {
          let bigliettiVenduti = this.isGruppoSpeciale ?
          {
          "validatore" : validatore,
          "nBigliettiInteri" : this.SearchForm.value.personeGruppo,
          "nBigliettiRidotti" : x.buyCountChild,
          "nazionalita" : this.SearchForm.value.nazione ,
          "idGruppo" : this.SearchForm.value.tipoGruppo,
          "tipologiaBiglietto" : {"id" : x.id},
          "contanti" :  isContanti,
          "totInteri": isEvento ? 0 : this.SearchForm.value.prezzo,
          "totRidotti": 0,
        }
        :
        {
          "validatore" : validatore,
          "nBigliettiInteri" : x.buyCountAdult,
          "nBigliettiRidotti" : x.buyCountChild,
          "nazionalita" : this.SearchForm.value.nazione ,
          "idGruppo" : this.SearchForm.value.tipoGruppo,
          "fermata": this.SearchForm.value.fermata,
          "giro": this.SearchForm.value.giro,
          "tipologiaBiglietto" : {"id" : x.id},
          "contanti" :  isContanti,
        }
        this.bigliettiVendutiList.push(bigliettiVenduti)

        });


        let dataEmissione = formatDate(Date.now(), "dd/MM/yyyy", "it-IT");

        this.bigliettiSelezionati.forEach(y => {
          let wrapperBigliettoUt = this.isGruppoSpeciale ?


          {
            "id" : this.idValidatore,
            "biglietto": { "id": y.id, "dataEmissioneToPrint": dataEmissione},
            "personeGruppo": this.SearchForm.value.personeGruppo,
            "nomeGruppo": this.SearchForm.value.nomeGruppo,
            "prezzo": this.SearchForm.value.prezzo
          }

          :

          {
            "id" : this.idValidatore,
            "biglietto": { "id": y.id, "dataEmissioneToPrint": dataEmissione}
          }

          this.wrapperBigliettoList.push(wrapperBigliettoUt)
        })

        let chiamataSmistataaddBigliettiVenduti = this.isGruppoSpeciale ? this.validatoreService.addBigliettiVendutiGruppo(this.bigliettiVendutiList , this.idValidatore) : this.validatoreService.addBigliettiVenduti(this.bigliettiVendutiList , this.idValidatore);
        let chiamataSmistataZpl = this.isGruppoSpeciale ? this.validatoreService.generateZplEventi(this.wrapperBigliettoList) : this.validatoreService.generateZpl(this.wrapperBigliettoList);

          forkJoin(
          // this.validatoreService.acquistaBiglietti(this.bigliettiSelezionati),
          chiamataSmistataaddBigliettiVenduti,
          chiamataSmistataZpl
          ).subscribe(
            ([secondMessage, thirdMessage]) => {
              this.openSnackBar(thirdMessage.messaggio, 'chiudi');
              this.loader.hide();
              this.navigation.goToStampaBiglietti();
            }
          )
      }
    },
    err => {
      this.openSnackBar(err.error ? err.error.error : "Errore di comunicazione con il server", 'chiudi');
      this.loader.hide();

    })
  }

  cardSelection(value) {
    this.paymentMethod = value;
    this.SearchForm.value.prezzo = this.paymentMethod == "no" ? 0 : this.SearchForm.value.prezzo;
  }

  compareById( a, b ) : boolean {
    return a && b && a.id === b.id;
  }

  sistemaAutoComplete() {
    this.filteredOptions = this.SearchForm.controls.nazione.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value)),
    );

  }

  filter(value: string): string[] {
    const filterValue = value.toLowerCase();
    return this.listaNazioni.filter(option => option.toLowerCase().startsWith(filterValue));
  }

  // isGruppoSpeciale(){
  //   return this.carrello[0].macrosettore.id == 'f8c035f9-275a-4f31-bb9d-10469a0bdc0a' ? true :  false;
  // }
}
