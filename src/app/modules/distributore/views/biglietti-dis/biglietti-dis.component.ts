import { CarrelloService } from '../../../../shared/services/carrello.service';
import { DistributoreNavigationService } from '../../services/distributore-navigation.service';
import { Component, Inject, OnInit } from '@angular/core';
import { DistributoreApiService } from '../../services/distributore-api.service';
import { ActivatedRoute } from '@angular/router';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { Location } from '@angular/common';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { AggiungiBigliettoDisComponent } from '../aggiungi-biglietto-dis/aggiungi-biglietto-dis.component';
import { LoaderService } from '@Src/app/loader/loader.service';

@Component({
  selector: 'app-biglietti-dis',
  templateUrl: './biglietti-dis.component.html',
  styleUrls: ['./biglietti-dis.component.scss']
})
export class BigliettiDisComponent implements OnInit {

  allTipologie;
  quantitaSelezionabili = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
  idMacrosettore;
  idFornitore;
  listaTipologieBiglietti = [];

  constructor(
    private distributoreApi: DistributoreApiService,
    private navigation: DistributoreNavigationService,
    private carrelloService: CarrelloService,
    private route: ActivatedRoute,
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    private dialog: MatDialog,
    private loader: LoaderService,
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.idFornitore = this.locStorage.get('idFornitore');
    this.idMacrosettore = this.locStorage.get('idMacrosettore');
    this.distributoreApi.getTipologieBiglietto(this.idMacrosettore).subscribe(
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
    this.distributoreApi.getTipologie().subscribe(
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
    dialogConfig.data = {
      id: tipologia.id,
      buyCountAdult : tipologia.buyCountAdult,
      buyCountChild : tipologia.buyCountChild
    }
    this.dialog.open(AggiungiBigliettoDisComponent, dialogConfig)
    .afterClosed().subscribe(
      data => {
        this.listaTipologieBiglietti.forEach(el => {

          if(el.id === data?.id){
            el.buyCountAdult = data.form.buyCountAdult;
            el.buyCountChild = data.form.buyCountChild;
          }

        });

    });
  }

}
