import { TipologiaBiglietto } from '../../../../core/models/tipologia-biglietto';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { CarrelloService } from '../../../../shared/services/carrello.service';
import { CoreApiService } from '@Src/app/core/services/core-api.service';
import { switchMap, tap } from 'rxjs/operators';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ValidatoreApiService } from '../../services/validatore-api.service';
import { ValidatoreNavigationService } from '../../services/validatore-navigation.service';

@Component({
  selector: 'app-carrello-val',
  templateUrl: './carrello-val.component.html',
  styleUrls: ['./carrello-val.component.scss']
})
export class CarrelloValComponent implements OnInit {

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
    private navigation: ValidatoreNavigationService,
    private coreService: CoreApiService,
    private validatoreService : ValidatoreApiService,
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService
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
    this.calcolaPrezzo();
  }

  checkAvailability() {
    if(this.carrello && this.carrello.length) {
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
        switchMap(() => this.validatoreService.bigliettiDisponibili(this.tipoBigliettiList, this.idDistributore))
        ).subscribe(
          res => {
            this.areBigliettiAvaibles = res.present;
            if(this.areBigliettiAvaibles) {
              !this.timerAlreadyStarted ? this.startTimer() : null;
              this.bigliettiRiservati = res.bigliettoList;
              this.carrelloService.setBiglietti(this.bigliettiRiservati);
            }
            this.tipoBigliettiList = []
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
    this.prezzoRivenditore = (this.prezzoCliente*95)/100;
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
        this.validatoreService.sbloccaBiglietti(this.bigliettiRiservati, this.idDistributore).subscribe(
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
    this.navigation.goToHome();
  }

}
