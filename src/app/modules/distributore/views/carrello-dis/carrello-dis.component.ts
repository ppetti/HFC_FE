import { TipologiaBiglietto } from '../../../../core/models/tipologia-biglietto';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CarrelloService } from '../../../../shared/services/carrello.service';
import { DistributoreNavigationService } from '../../services/distributore-navigation.service';
import { CoreApiService } from '@Src/app/core/services/core-api.service';
import { DistributoreApiService } from '../../services/distributore-api.service';
import { switchMap, tap } from 'rxjs/operators';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from '@Src/app/modules/amministratore/services/amministratore-api.service';

@Component({
  selector: 'app-carrello-dis',
  templateUrl: './carrello-dis.component.html',
  styleUrls: ['./carrello-dis.component.scss']
})
export class CarrelloDisComponent implements OnInit {

  carrello: any[];
  quantitaSelezionabili = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  prezzoCliente: number = 0;
  prezzoRivenditore: number = 0;
  userInfo;
  idDistributore: string;
  tipoBigliettiList: any[] = [];
  areBigliettiAvaibles: false;
  timeLeft: number = 300;
  min = 5;
  sec = 0;
  bigliettiRiservati: any;
  timerAlreadyStarted = false;
  isCarrelloEmpty = false;

  interval;


  constructor(
    private carrelloService: CarrelloService,
    private navigation: DistributoreNavigationService,
    private coreService: CoreApiService,
    private distributoreService : DistributoreApiService,
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    private loader: LoaderService,
    private amministratoreService: AmministratoreApiService,
  ) {

    carrelloService.getCarrello().subscribe(
      oggettiCarrello => {
        this.carrello = oggettiCarrello;
        console.log('CarrelloComponent -> ngOnInit -> this.carrello', this.carrello);
      }
    );
    carrelloService.getCarrelloItems();
  }


  ngOnInit(): void {
    this.loader.show();
    this.coreService.whoAmI().subscribe( userDetail => {
      this.userInfo = userDetail;
      this.idDistributore = this.userInfo.id;
      this.calcolaPrezzo();
    }),error => this.loader.hide();
  }

  checkAvailability() {
    if(this.carrello && this.carrello.length) {
      this.loader.show();
      this.carrello.forEach(tb => {
        let wrapper = {
          "buyCountChild" : tb.buyCountChild,
          "buyCountAdult" : tb.buyCountAdult,
          "tipologiaBiglietto" : tb
        }
        this.tipoBigliettiList.push(wrapper)
      });

      this.coreService.whoAmI().pipe(
        tap(userDetail => {
          this.userInfo = userDetail;
          this.idDistributore = this.userInfo.id;
        }),
        switchMap(() => this.distributoreService.bigliettiDisponibili(this.tipoBigliettiList, this.idDistributore))
        ).subscribe(
          res => {
            this.areBigliettiAvaibles = res.present;
            if(this.areBigliettiAvaibles) {
              !this.timerAlreadyStarted ? this.startTimer() : null;
              this.bigliettiRiservati = res.bigliettoList;
              this.carrelloService.setBiglietti(this.bigliettiRiservati);
            }
            this.tipoBigliettiList = []
            this.loader.hide();
          },
          ()=> this.tipoBigliettiList = []
        )
    } else {
      this.isCarrelloEmpty = true;
    }
  }

  calcolaPrezzo() {
    this.prezzoCliente = 0;
    this.carrello?.forEach(tipologia => {
      this.prezzoCliente = (tipologia.prezzo_full * tipologia.buyCountAdult) +
                            (tipologia.prezzo_child * tipologia.buyCountChild) + this.prezzoCliente;
    });
    // this.prezzoRivenditore = (this.prezzoCliente*95)/100;

    this.amministratoreService.getListinoprezziByDistributore(this.idDistributore).subscribe(res => {
      let prezzoTotaleRivenditore = 0;
      this.carrello?.forEach(tipologia => {
        let listinoPrezzi = res.listaPrezzi;
        listinoPrezzi.forEach(elListino => {
          if(tipologia.combinazione){

            if(tipologia.combinazione.tipologia1.id == elListino.tipologiaBiglietto.id){

              prezzoTotaleRivenditore = prezzoTotaleRivenditore + tipologia.buyCountAdult * (elListino.tipologiaBiglietto.prezzo_full - elListino.sconto_adult) + tipologia.buyCountChild * (elListino.tipologiaBiglietto.prezzo_child - elListino.sconto);
            }

            if(tipologia.combinazione.tipologia2.id == elListino.tipologiaBiglietto.id){

              prezzoTotaleRivenditore = prezzoTotaleRivenditore + tipologia.buyCountAdult * (elListino.tipologiaBiglietto.prezzo_full - elListino.sconto_adult) + tipologia.buyCountChild * (elListino.tipologiaBiglietto.prezzo_child - elListino.sconto);
            }
          }
          if(tipologia.id == elListino.tipologiaBiglietto.id){

            prezzoTotaleRivenditore = prezzoTotaleRivenditore + tipologia.buyCountAdult * (elListino.tipologiaBiglietto.prezzo_full - elListino.sconto_adult) + tipologia.buyCountChild * (elListino.tipologiaBiglietto.prezzo_child - elListino.sconto);
          }
        });

      });
      this.prezzoRivenditore = prezzoTotaleRivenditore;
      this.loader.hide();
    })
  ;
    this.checkAvailability();
  }

  procedi(): void {
    console.log('CarrelloComponent -> procedi -> this.carrello', this.carrello);
    this.carrelloService.refreshCarrello(this.carrello);
    this.carrelloService.setPrezzi(this.prezzoCliente, this.prezzoRivenditore);
    this.stopTimer();
    this.navigation.goToRiepilogo();
  }

  backToBuy(): void {
    this.locStorage.get('idMacrosettore') ? this.navigateToBiglietti() : this.navigateToHome();
  }

  startTimer() {
    this.interval = setInterval(() => {
      if(this.timeLeft > 0) {
        this.timerAlreadyStarted = true;
        this.timeLeft--;
        this.min = Math.floor(this.timeLeft % 3600 / 60);
        this.sec = Math.floor(this.timeLeft % 3600 % 60);
      } else {
        this.distributoreService.sbloccaBiglietti(this.bigliettiRiservati, this.idDistributore).subscribe(
          res => console.log(res.messaggio)
        )
        this.timerAlreadyStarted = false;
        this.stopTimer();
        this.navigateToBiglietti();
      }
    },1000)
  }

  stopTimer() {
    if(this.interval) {
      clearInterval(this.interval);
    }
  }

  navigateToBiglietti() {
    this.navigation.goToBiglietti();
  }

  navigateToHome() {
    this.navigation.goToSelezionaCliente();
  }

}
