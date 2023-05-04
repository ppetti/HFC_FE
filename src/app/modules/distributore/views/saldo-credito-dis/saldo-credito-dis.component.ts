import { DistributoreNavigationService } from '@Src/app/modules/distributore/services/distributore-navigation.service';
import { Component, OnInit } from '@angular/core';
import { CoreApiService } from '@Src/app/core/services/core-api.service';
import { LoaderService } from '@Src/app/loader/loader.service';
import { ValidatoreNavigationService } from '@Src/app/modules/validatore/services/validatore-navigation.service';
import { DistributoreApiService } from '../../services/distributore-api.service';
import { Util } from '@Src/app/shared/util';
import { ModalService } from '@Src/app/shared/services/modal.service';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { MatSnackBar } from '@angular/material/snack-bar';
import { of } from 'rxjs';
import { loadStripe } from '@stripe/stripe-js';

@Component({
  selector: 'app-saldo-credito-dis',
  templateUrl: './saldo-credito-dis.component.html',
  styleUrls: ['./saldo-credito-dis.component.scss']
})
export class SaldoCreditoDisComponent implements OnInit {

  userInfo;
  distributore;
  paymentMethod: any = null;

  key = '';

  titoloPagamento = "Salda credito"
  descrizionePagamento = "acc. distributore IOBUS"
  stripeToken;

  stripe: any;
  form = document.getElementById('payment-form');

  inizioPagamento = true;
  display = false;

  elements: any;
  card: any;
  isPagamentoConCarta;


  constructor(
    private navigation: DistributoreNavigationService,
    private coreService: CoreApiService,
    private distributoreService: DistributoreApiService,
    private loader: LoaderService,
    private util: Util,
    private modalService: ModalService,
    private _snackBar: MatSnackBar,
  ) { }

  ngOnInit() {

    this.loader.show();
    this.coreService.whoAmI().subscribe(
      userDetail => {
        this.userInfo = userDetail;
        if (this.userInfo.ruolo.nome_ruolo == 'Rivenditore') {
          this.distributoreService.getDistributoreById(this.userInfo.id).subscribe(
            dist => {
              this.distributore = dist;
            })
        }
        this.loader.hide();
      })

    this.distributoreService.getStripePublicKey().subscribe(async res => {
      this.key = res.key; this.loader.hide();

      const script = window.document.createElement("script");
      script.id = "stripe-script";
      script.type = "text/javascript";
      script.src = "https://js.stripe.com/v3/";
      this.stripe = await loadStripe(this.key);
      this.elements = this.stripe.elements();

      // var style = {
      //   base: {
      //     color: "#32325d",
      //     fontFamily: 'Arial, sans-serif',
      //     fontSmoothing: "antialiased",
      //     fontSize: "16px",
      //     "::placeholder": {
      //       color: "#32325d"
      //     }
      //   },
      //   invalid: {
      //     fontFamily: 'Arial, sans-serif',
      //     color: "#fa755a",
      //     iconColor: "#fa755a"
      //   }
      // };
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

      // this.card = this.elements.create('card', {
      //   style: {
      //     base: {
      //       iconColor: '#32325d',
      //       color: '#000',
      //       fontWeight: '500',
      //       fontFamily: 'Roboto, Open Sans, Segoe UI, sans-serif',
      //       fontSize: '20px',
      //       fontSmoothing: 'antialiased',
      //       ':-webkit-autofill': {
      //         color: '#fce883',
      //       },
      //       '::placeholder': {
      //         color: '#87BBFD',
      //       },
      //     },
      //     invalid: {
      //       iconColor: '#FFC7EE',
      //       color: '#FFC7EE',
      //     },
      //   },
      // });
      this.card = this.elements.create("card", { hidePostalCode: true, style: style });
      this.card.mount('#card-element');

      // this.card = this.elements.create('card', { style: {} });

    });
  }

  backToSelezioneCliente() {
    this.navigation.goToSelezionaCliente();
  }

  cardSelection(value) {
    this.paymentMethod = value;

    if (this.paymentMethod == "pos") {
      this.isPagamentoConCarta = true;
    }
    if (this.paymentMethod == "cash") {
      this.isPagamentoConCarta = false;
    }
  }

  acquista() {
    let message = this.paymentMethod == "pos" ? 'Effettuare il pagamento tramite la carta inserita?' : 'Pagamento in contanti in corso';
    let title = 'Confermi l\'operazione?';
    this.modalService.openModal(title, message)
      .afterClosed().subscribe(async res => {
        if (res) {
          if (this.paymentMethod == "pos") {
            document.getElementById('submit').click();
          }
        }

      })
  }


  async submit(event) {
    this.loader.show();
    event.preventDefault()

    let objToken = {
      description: this.descrizionePagamento + " " + this.userInfo.login,
      distributore: this.distributore
    }

    this.distributoreService.getSecretPaymentIntent(objToken).subscribe(async res => {

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
        this.openSnackBar(stripeError.message, "chiudi")
        return;
      }

      if (paymentIntent) {
        this.distributore.creditoDisponibile = this.distributore.creditoTotale;
        this.distributoreService.editDistributore(this.distributore).subscribe(res => {

          this.distributoreService.getDistributoreById(this.userInfo.id).subscribe(dist => {
            this.display = false;
            this.loader.hide();
            this.distributore = dist;
            this.isPagamentoConCarta = false;
            this.openSnackBar("Operazione avvenuta con successo", "chiudi")
          });

        });
      }

    }),
      error => {
        this.loader.hide();
        this.openSnackBar(error.message, "chiudi")
      };


  }





  // //SI DEPRECA FRA 3 GIORNI
  // createStripeSession(objSessionOpener){
  //   this.distributoreService.stripeOpenSession(objSessionOpener).subscribe(res => {

  //     console.log(res);
  //     this.stripe.redirectToCheckout({
  //       // Make the id field from the Checkout Session creation API response
  //       // available to this file, so you can provide it as argument here
  //       // instead of the {{CHECKOUT_SESSION_ID}} placeholder.

  //       sessionId: res.id
  //     }).then(function (result) {
  //       // If `redirectToCheckout` fails due to a browser or network
  //       // error, display the localized error message to your customer
  //       // using `result.error.message`.
  //     });
  //   });
  // }



  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 15000,
    });
  }
}
