import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CoreApiService } from '@Src/app/core/services/core-api.service';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith, switchMap, tap } from 'rxjs/operators';
import { CarrelloService } from '../../../../shared/services/carrello.service';
import { DistributoreApiService } from '../../services/distributore-api.service';
import { DistributoreNavigationService } from '../../services/distributore-navigation.service';
import * as i18nIsoCountries from 'i18n-iso-countries';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { LoaderService } from '@Src/app/loader/loader.service';
import { formatDate } from '@angular/common';
import { ModalService } from './../../../../shared/services/modal.service';
import { loadStripe } from '@stripe/stripe-js';

declare const require;

@Component({
  selector: 'app-riepilogo-dis',
  templateUrl: './riepilogo-dis.component.html',
  styleUrls: ['./riepilogo-dis.component.scss']
})
export class RiepilogoDisComponent implements OnInit {

  prezzoRivenditore: number;
  prezzoCliente: number;
  margine: number;
  carrello: any[];
  nAdulti: number = 0;
  nRidotti: number = 0;
  bigliettiSelezionati: any[];
  idDistributore: string;
  distributore;
  bigliettiVendutiList= [];
  wrapperBigliettoList = [];
  fermateList: any[] = [];
  paymentMethod;

  //listaNazioni: string[] = [];
  listaNazioni: string[] = ["ITALIA","REGNO UNITO","FRANCIA","GERMANIA","SPAGNA","PORTOGALLO","GIAPPONE","RUSSIA","ALTRO",];
  tipoGruppoList = []

  filteredOptions: Observable<string[]>;

  SearchForm = new FormGroup
    ({
    nazione: new FormControl(''),
    tipoGruppo: new FormControl(null),
    fermata: new FormControl(null)
    });

  inizioPagamento = true;
  display = false;

  elements: any;
  card: any;
  stripe: any;
  key = '';
  isPagamentoConCarta;
  descrizionePagamento = "acc. distributore IOBUS"
  bigliettiVendutiEliminabili;


  constructor(
    private navigation: DistributoreNavigationService,
    private carrelloService: CarrelloService,
    private distributoreService: DistributoreApiService,
    private _snackBar: MatSnackBar,
    private coreService: CoreApiService,
    private fb: FormBuilder,
    private loader: LoaderService,
    private modalService: ModalService,
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
    this.coreService.whoAmI().pipe(
      tap(userInfo => {
        this.idDistributore = userInfo.id; }),
      switchMap(() => this.distributoreService.getDistributoreById(this.idDistributore))
    ).subscribe(
      distributore => {
        this.distributore = distributore;
        this.loader.hide();
      }
    )

    forkJoin([
      this.distributoreService.getAllGruppi(),
      this.distributoreService.getAllFermate()
    ]).subscribe(
      ([gruppo, fermate]) => {
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
        this.tipoGruppoList = gruppo;
        this.loader.hide();
    });


    this.distributoreService.getStripePublicKey().subscribe(async res => {
      this.key = res.key; this.loader.hide();

      const script = window.document.createElement("script");
      script.id = "stripe-script";
      script.type = "text/javascript";
      script.src = "https://js.stripe.com/v3/";
      this.stripe = await loadStripe(this.key);
      this.elements = this.stripe.elements();

      var style = {
        base: {
          color: "#000",
          iconColor: '#03A9F4',
          fontSmoothing: "antialiased",
          fontSize: '20px',
          fontWeight: '500',
          lineHeight: '40px'
        },
        invalid: {
          fontFamily: 'Arial, sans-serif',
          color: "#fa755a",
          iconColor: "#fa755a"
        },
        complete: {
          fontFamily: 'Arial, sans-serif',
          color: "#2e7d32",
          iconColor: "#2e7d32"
        }
      };

      this.card = this.elements.create("card", { hidePostalCode: true, style: style });
      this.card.mount('#card-element');

  });

}

  getPrezzi(){
    this.prezzoRivenditore = this.carrelloService.getPrezzoRivenditore();
    this.prezzoCliente = this.carrelloService.getPrezzoCliente();
    this.margine = (this.prezzoCliente - this.prezzoRivenditore)
    if(isNaN(this.margine) ){
      this.navigation.goToSelezionaCliente();
    }
  }

  getNTipologie() {
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
        this.isPagamentoConCarta = false;
        this.loader.show();
        let distributore = {
          "id" : this.idDistributore
        }
        this.carrello.forEach(x => {
          let bigliettiVenduti = {
          "distributore" : distributore,
          "nBigliettiInteri" : x.buyCountAdult,
          "nBigliettiRidotti" : x.buyCountChild,
          "nazionalita" : this.SearchForm.value.nazione ,
          "idGruppo" : this.SearchForm.value.tipoGruppo,
            "fermata": this.SearchForm.value.fermata,
          "tipologiaBiglietto" : {"id" : x.id},
          "contanti" :  false
        }
        this.bigliettiVendutiList.push(bigliettiVenduti)

        });

        let dataEmissione = formatDate(Date.now(), "dd/MM/yyyy", "it-IT");

        this.bigliettiSelezionati.forEach(y => {
          let wrapperBigliettoUt = {
            "id" : this.idDistributore,
            "biglietto" : { "id" : y.id, "dataEmissioneToPrint": dataEmissione}
          }

          this.wrapperBigliettoList.push(wrapperBigliettoUt)
        })

        if(this.paymentMethod == 'pos') {
          this.acquistoBiglietti("pos");
          //  this.acquistoBiglietti();
        } else {

          this.isPagamentoConCarta = false;
          let wrapper = {
            costo: this.prezzoRivenditore
          }
          this.acquistoBiglietti();

          this.navigation.goToStampaBiglietti();
        }
        console.log(this.SearchForm.controls)


      }
    },
    err => {
      this.openSnackBar(err.error ? err.error.error : "Errore di comunicazione con il server", 'chiudi');
      this.loader.hide();

    })

     }

  acquistoBiglietti(pos?) {
    forkJoin(
      this.distributoreService.acquistaBiglietti(this.bigliettiSelezionati),
      this.distributoreService.addBigliettiVendutiConRitorno(this.bigliettiVendutiList , this.idDistributore),
      this.distributoreService.generateZpl(this.wrapperBigliettoList),

      ).subscribe(
        ([firstMessage, ritornoVenduti, thirdMessage]) => {
          this.openSnackBar(firstMessage.messaggio, 'chiudi');
          this.bigliettiVendutiEliminabili = ritornoVenduti;
          if(pos == "pos"){
            document.getElementById('submit').click();
          }

          if(!pos){
            this.distributoreService.sottraiCreditoSafe(this.idDistributore, this.bigliettiVendutiList).subscribe(
              wrapperMB => {
                if(!wrapperMB.present) {
                  this.openSnackBar(wrapperMB.messaggio, 'chiudi');
                } else {
              }
            })
          }
        }
      )
  }

  cardSelection(value) {
    this.paymentMethod = value;

    if (this.paymentMethod == "pos") {

      this.isPagamentoConCarta = true;
      // window.scrollTo(0,document.body.scrollHeight);
      setTimeout( () => {
        let elHtml = document.getElementById('info-carta');
        elHtml.scrollIntoView({ behavior: "smooth"});
      }, 300)

    }
    if (this.paymentMethod == "credito") {
      this.isPagamentoConCarta = false;
    }

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
    return this.listaNazioni.filter(option => option.toLowerCase().includes(filterValue));
  }

  async submit(event) {
    this.loader.show();
    event.preventDefault()

    let objToken = {
      bigliettiVendutiList: this.bigliettiVendutiList,
      distributore: this.distributore
    }

    this.distributoreService.getSecretPaymentIntentVenditaDistributore(objToken).subscribe(async res => {

      const { error: stripeError, paymentIntent } = await this.stripe.confirmCardPayment(
        res.id,
        {
          payment_method: {
            card: this.card,
            billing_details: {
              name: this.distributore.login
            },
          },
        }
      );

      if (stripeError) {
        this.loader.hide();

        this.annullaVendita();
        this.openSnackBar(stripeError.message, "chiudi")
        return;
      }

      if (paymentIntent) {
        this.loader.hide();
        this.isPagamentoConCarta = false;
        this.openSnackBar("Operazione avvenuta con successo", "chiudi");
        this.navigation.goToStampaBiglietti();
      }

    }),
      error => {
        this.loader.hide();
        this.annullaVendita();
        this.openSnackBar(error.message, "chiudi")
      };


  }

  annullaVendita(){
    forkJoin(
      this.distributoreService.annullaAcquistoBiglietti(this.bigliettiSelezionati),
      this.distributoreService.annullaCreazioneBigliettiVenduti(this.bigliettiVendutiEliminabili),
      ).subscribe(
        ([firstMessage, secondMessage]) => {

          this.isPagamentoConCarta = true;

        }
      )
  }
}
