import { CarrelloService } from '../../../../shared/services/carrello.service';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ValidatoreApiService } from '../../services/validatore-api.service';
import { ValidatoreNavigationService } from '../../services/validatore-navigation.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AggiungiBigliettoValComponent } from '../aggiungi-biglietto-val/aggiungi-biglietto-val.component';
import { LoaderService } from '@Src/app/loader/loader.service';
import { Util } from '@Src/app/shared/util';

@Component({
  selector: 'app-biglietti-val',
  templateUrl: './biglietti-val.component.html',
  styleUrls: ['./biglietti-val.component.scss']
})
export class BigliettiValComponent implements OnInit {

  allTipologie;
  quantitaSelezionabili = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  idMacrosettore;
  idFornitore;
  listaTipologieBiglietti = [];
  isGruppoSpeciale: boolean;

  constructor(
    private validatoreApi: ValidatoreApiService,
    private navigation: ValidatoreNavigationService,
    private carrelloService: CarrelloService,
    private route: ActivatedRoute,
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    private dialog: MatDialog,
    private loader: LoaderService,
    private util : Util,
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.idFornitore = this.locStorage.get('idFornitore');
    this.idMacrosettore = this.locStorage.get('idMacrosettore');

    this.validatoreApi.getTipologieBiglietto(this.idMacrosettore).subscribe(
      tipologiaBiglietto=> {
        this.listaTipologieBiglietti=tipologiaBiglietto;
        this.listaTipologieBiglietti.map(x => {
          x.buyCountAdult = 0;
          x.buyCountChild = 0;
        })
        this.loader.hide();
      }
    )
    /*
    this.validatoreApi.getTipologie().subscribe(
      tipologie => {
        this.allTipologie = tipologie;
        this.allTipologie.map( x => {
          x.buyCountAdult = 0;
          x.buyCountChild = 0;
        });
      }
    );
    */
  }

  aggiungiAlCarrello(): void {
    const carrello = this.listaTipologieBiglietti.filter(x => x.buyCountAdult || x.buyCountChild);
    this.carrelloService.refreshCarrello(carrello);
    this.navigation.goToCarrello();
  }

  backToSelezionaMacrosettore() {
    this.locStorage.remove('idMacrosettore')
    this.navigation.goToSelezionaMacrosettore(this.idFornitore);
  }

  aggiungiBiglietto(tipologia) {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.width = "85%";
    dialogConfig.data = tipologia.macrosettore.gruppoSpeciale ?
    {
      id: tipologia.id,
      buyCountAdult : tipologia.buyCountAdult,
    }
    :
    {
      id: tipologia.id,
      buyCountAdult : tipologia.buyCountAdult,
      buyCountChild : tipologia.buyCountChild
    }

    this.dialog.open(AggiungiBigliettoValComponent, dialogConfig)
    .afterClosed().subscribe(
      data => {
        this.listaTipologieBiglietti.forEach(el => {

          if(el.id === data?.id){
            el.buyCountAdult = data.form.buyCountAdult;
            el.buyCountChild = tipologia.macrosettore.gruppoSpeciale ? 0 : data.form.buyCountChild;
          }

        });
        this.isGruppoSpeciale = this.listaTipologieBiglietti.filter(x => x.buyCountAdult || x.buyCountChild).length > 1 && this.listaTipologieBiglietti[0].macrosettore.gruppoSpeciale ? true : false;
    });
  }

}
