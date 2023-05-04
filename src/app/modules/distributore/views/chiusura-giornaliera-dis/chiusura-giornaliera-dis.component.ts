import { Component, Inject, OnInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DistributoreApiService } from '../../services/distributore-api.service';
import { DistributoreNavigationService } from '../../services/distributore-navigation.service';
import jwt_decode from 'jwt-decode';
import { CoreApiService } from '@Src/app/core/services/core-api.service';
import { switchMap, tap } from 'rxjs/operators';
import { MinLengthValidator } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from '@Src/app/modules/amministratore/services/amministratore-api.service';

@Component({
  selector: 'app-chiusura-giornaliera-dis',
  templateUrl: './chiusura-giornaliera-dis.component.html',
  styleUrls: ['./chiusura-giornaliera-dis.component.scss']
})
export class ChiusuraGiornalieraDisComponent implements OnInit {

  userInfo: any;
  isChiusuraAlreadyPresent: boolean;
  idChiusura: any;
  bigliettiVendutiList: any[];
  nRidotti: number;
  nInteri: number;
  totRidotti: number;
  totInteri: number;
  prezzoRivenditore:any;

  constructor(
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    private navigation: DistributoreNavigationService,
    private distributoreService: DistributoreApiService,
    private coreService: CoreApiService,
    private _snackBar: MatSnackBar,
    private loader: LoaderService,
    private amministratoreService: AmministratoreApiService,
  ) { }

  ngOnInit(): void {
    this.coreService.whoAmI().subscribe(
      userDetail => {
        this.userInfo = userDetail;
        this.checkChiusura();
      })
  }

  checkChiusura(){
    this.loader.show();
    let lista = [];
    this.distributoreService.chiusuraAlreadyPresent(this.userInfo.id, {data: null}).pipe(
      tap(wrapper => {
        this.isChiusuraAlreadyPresent = wrapper.present;
        this.idChiusura = this.isChiusuraAlreadyPresent ? wrapper.chiusuraId : null;
      }),
      switchMap(() => this.distributoreService.bigliettiVendutiGiornalieri(this.userInfo.id))
      ).subscribe(
          listaBiglietti => {
        this.bigliettiVendutiList = listaBiglietti;
        this.nRidotti = 0;
        this.nInteri = 0;
        this.totRidotti = 0;
        this.totInteri = 0;
        this.bigliettiVendutiList.forEach(b => {
          this.nRidotti += b.nBigliettiRidotti;
          this.nInteri += b.nBigliettiInteri;
          this.totInteri += b.totInteri;
          this.totRidotti += b.totRidotti;


          let isPresent = false;

          lista.forEach(el => {
            if(el.tipologiaBiglietto.id == b.tipologiaBiglietto.id){
              isPresent = true;
              el.nBigliettiRidotti += b.nBigliettiRidotti;
              el.nBigliettiInteri += b.nBigliettiInteri;
              el.totInteri += b.totInteri;
              el.totRidotti += b.totRidotti;

            }

          });

          if(!isPresent){
            lista.push(b);
          }

        });
        this.bigliettiVendutiList = lista;

        this.amministratoreService.getListinoprezziByDistributore(this.userInfo.id).subscribe(res => {
          let prezzoTotaleRivenditore = 0;

          this.bigliettiVendutiList.forEach(bigliettoVenduto => {
            let listinoPrezzi = res.listaPrezzi;
            listinoPrezzi.forEach(elListino => {

              if(bigliettoVenduto.tipologiaBiglietto.id == elListino.tipologiaBiglietto.id){
                prezzoTotaleRivenditore = prezzoTotaleRivenditore + bigliettoVenduto.nBigliettiInteri * (elListino.tipologiaBiglietto.prezzo_full - elListino.sconto_adult) + bigliettoVenduto.nBigliettiRidotti * (elListino.tipologiaBiglietto.prezzo_child - elListino.sconto);
              }

            });

          });

          this.prezzoRivenditore = prezzoTotaleRivenditore;

          this.loader.hide();
        })
      ;


      })
  }

  backToLand() {
    this.navigation.goToSelezionaCliente();
  }

  downloadChiusura() {
    this.loader.show();
    this.distributoreService.getChiusuraById(this.idChiusura).subscribe(
      chiusura => {
        let data = new Date(chiusura.data).toLocaleDateString();
        data = data.split('/').join('-');
        const linkSource = `data:application/pdf;base64,${chiusura.pdf}`;
        const downloadLink = document.createElement("a");
        const fileName = "chiusura_" + data + ".pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        this.loader.hide();
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  effettuaChiusura() {
    let idDistributore = this.userInfo.id;
    this.distributoreService.addChiusura(idDistributore, {data: null}).subscribe(
      res => {
        this.checkChiusura();
        this.openSnackBar(res.messaggio,'chiudi');
      }
    )
  }

}
