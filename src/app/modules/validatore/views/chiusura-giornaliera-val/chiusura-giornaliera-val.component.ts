import { Component, Inject, OnInit } from '@angular/core';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import jwt_decode from 'jwt-decode';
import { CoreApiService } from '@Src/app/core/services/core-api.service';
import { switchMap, tap } from 'rxjs/operators';
import { MinLengthValidator } from '@angular/forms';
import { MAT_DATE_FORMATS } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ValidatoreApiService } from '../../services/validatore-api.service';
import { ValidatoreNavigationService } from '../../services/validatore-navigation.service';
import { number } from 'echarts';
import { LoaderService } from '@Src/app/loader/loader.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-chiusura-giornaliera-val',
  templateUrl: './chiusura-giornaliera-val.component.html',
  styleUrls: ['./chiusura-giornaliera-val.component.scss']
})
export class ChiusuraGiornalieraValComponent implements OnInit {

  userInfo: any;
  isChiusuraAlreadyPresent: boolean;
  idChiusura: any;
  bigliettiVendutiList: any[];
  nRidotti: number = 0;
  nInteri: number = 0;
  totRidotti: number = 0;
  totInteri: number = 0;
  totContanti: number = 0;
  totValidati: number = 0;

  hasOta;

  validatiPerTipologia: any[] = [];
  validatiOta: any[] = [];
  distributoriOta: any;
  validatiVox = [];

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

        // this.validatoreService.getAllDistributoriOta().subscribe(
        //   listaDistOta => {
        //     this.distributoriOta = listaDistOta;
        //     this.checkChiusura();
        //     this.checkValidati();
        //   });

        this.checkChiusura();
        // this.checkValidati();
      });


  }

  checkValidati(res){
    this.hasOta = false;
    const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
      arr.reduce((groups, item) => {
        (groups[key(item)] ||= []).push(item);
        return groups;
      }, {} as Record<K, T[]>);


      let bigliettiArray: any[];
      this.validatiPerTipologia = [];
      bigliettiArray = res;
      this.totValidati = res.length;

      this.distributoriOta.forEach(distributoreOta => {
        if(distributoreOta.listaBiglietti == undefined){
          distributoreOta.listaBiglietti = [];
        }

        bigliettiArray.forEach(biglietto => {
          if(distributoreOta.id == biglietto.distributoreOta){
            this.hasOta = true;
            let validatoOta: any = {};
            validatoOta.nAdult = biglietto.bigliettoFull ? 1 : 0;
            validatoOta.nChild = !biglietto.bigliettoFull ? 1 : 0;
            validatoOta.tipologia = biglietto.tipologiaBiglietto.titolo;
            validatoOta.idTipologia = biglietto.tipologiaBiglietto.id;
            validatoOta.prezzo_child = biglietto.tipologiaBiglietto.prezzo_child;
            validatoOta.prezzo_full = biglietto.tipologiaBiglietto.prezzo_full
            validatoOta.idOta = biglietto.distributoreOta;

            let flagPresente = false;
            if(distributoreOta.listaBiglietti.length > 0){
              distributoreOta.listaBiglietti.forEach(bigliettoInListaDistributore => {
                if(bigliettoInListaDistributore.idTipologia == validatoOta.idTipologia){
                  bigliettoInListaDistributore.nAdult = bigliettoInListaDistributore.nAdult + validatoOta.nAdult;
                  bigliettoInListaDistributore.nChild = bigliettoInListaDistributore.nChild + validatoOta.nChild;
                  flagPresente = true;
                }
              });
            }
            if(!flagPresente){
              distributoreOta.listaBiglietti.push(validatoOta);
            }

          }
        });

      });



      bigliettiArray = bigliettiArray.filter(biglietto => biglietto.distributoreOta == null);
      let results = groupBy(bigliettiArray, i => i.tipologiaBiglietto.id);
      Object.keys(results).forEach(key => {
        let arrayPerTipologia = results[key];
        let tipologia = arrayPerTipologia[0].tipologiaBiglietto;
        let validato: any = {};
        validato.nAdult = [...arrayPerTipologia].filter(x => x.bigliettoFull == true).length;
        validato.nChild = [...arrayPerTipologia].filter(x => x.bigliettoFull == false).length;
        validato.tipologia = tipologia.titolo;
        validato.prezzo_child = tipologia.prezzo_child;
        validato.prezzo_full = tipologia.prezzo_full

        this.validatiPerTipologia.push(validato);
      })
      console.log("🚀 ~ file: chiusura-giornaliera-val.component.ts ~ line 80 ~ ChiusuraGiornalieraValComponent ~ Object.keys ~ this.validatiPerTipologia", this.validatiPerTipologia)



      // let bigliettiArray: any[];
      // bigliettiArray = res;
      // this.totValidati = res.length;

      // // this.distributoriOta = [];


      // // this.distributoriOta = JSON.parse(JSON.stringify(this.distributoriOtaBackup));
      // this.distributoriOta.forEach(el => {
      //   el.listaBiglietti = [];
      // });

      // let results = groupBy(bigliettiArray, i =>  i.tipologiaBiglietto.id);
      // Object.keys(results).forEach(key => {
      //   let arrayPerTipologia = results[key];
      //   let tipologia = arrayPerTipologia[0].tipologiaBiglietto;
      //   let flagAppoggio = false;



      //   if(arrayPerTipologia[0].distributoreOta != null){

      //     let validatoOta: any = {};
      //     validatoOta.nAdult = [...arrayPerTipologia].filter(x => x.bigliettoFull == true).length;
      //     validatoOta.nChild = [...arrayPerTipologia].filter(x => x.bigliettoFull == false).length;
      //     validatoOta.tipologia = tipologia.titolo;
      //     validatoOta.prezzo_child = tipologia.prezzo_child;
      //     validatoOta.prezzo_full = tipologia.prezzo_full
      //     validatoOta.idOta = arrayPerTipologia[0].distributoreOta;
      //     this.validatiOta.push(validatoOta);

      //     this.distributoriOta.forEach(distributore => {
      //       if(validatoOta.idOta == distributore.id && !flagAppoggio){
      //         distributore.listaBiglietti = [];
      //         distributore.listaBiglietti.push(validatoOta);
      //       }
      //     });


      //   } else {

      //     if(!flagAppoggio){
      //       let validato: any = {};
      //       validato.nAdult = [...arrayPerTipologia].filter(x => x.bigliettoFull == true).length;
      //       validato.nChild = [...arrayPerTipologia].filter(x => x.bigliettoFull == false).length;
      //       validato.tipologia = tipologia.titolo;
      //       validato.prezzo_child = tipologia.prezzo_child;
      //       validato.prezzo_full = tipologia.prezzo_full
      //       this.validatiPerTipologia.push(validato);
      //       flagAppoggio = true;
      //     }

      //   }


      // })
      // console.log("🚀 ~ file: chiusura-giornaliera-val.component.ts ~ line 80 ~ ChiusuraGiornalieraValComponent ~ Object.keys ~ this.validatiPerTipologia", this.validatiPerTipologia)

    //  this.validatoreService.getBigliettiTimbrati(this.userInfo.id).subscribe( res => {
    //   let bigliettiArray: any[];
    //   bigliettiArray = res;
    //   this.totValidati = res.length;
    //   let results = groupBy(bigliettiArray, i =>  i.tipologiaBiglietto.id);
    //   Object.keys(results).forEach(key => {
    //     let arrayPerTipologia = results[key];
    //     let tipologia = arrayPerTipologia[0].tipologiaBiglietto;


    //     if(arrayPerTipologia[0].distributoreOta != null){

    //       let validatoOta: any = {};
    //       validatoOta.nAdult = [...arrayPerTipologia].filter(x => x.bigliettoFull == true).length;
    //       validatoOta.nChild = [...arrayPerTipologia].filter(x => x.bigliettoFull == false).length;
    //       validatoOta.tipologia = tipologia.titolo;
    //       validatoOta.prezzo_child = tipologia.prezzo_child;
    //       validatoOta.prezzo_full = tipologia.prezzo_full
    //       validatoOta.idOta = arrayPerTipologia[0].distributoreOta;
    //       this.validatiOta.push(validatoOta);
    //       console.log('aooooo', arrayPerTipologia, validatoOta, arrayPerTipologia.filter(x => x.distributoreOta != null) )
    //       // this.validatiOta.push(arrayPerTipologia.filter(x => x.distributoreOta != null));

    //       this.distributoriOta.forEach(distributore => {
    //         if(validatoOta.idOta == distributore.id){
    //           distributore.listaBiglietti = [];
    //           distributore.listaBiglietti.push(validatoOta);
    //         }
    //       });

    //       console.log(this.distributoriOta, 'disdsjosdjsoj')

    //     } else {
    //       let validato: any = {};
    //       console.log('aooooo', arrayPerTipologia)
    //       validato.nAdult = [...arrayPerTipologia].filter(x => x.bigliettoFull == true).length;
    //       validato.nChild = [...arrayPerTipologia].filter(x => x.bigliettoFull == false).length;
    //       validato.tipologia = tipologia.titolo;
    //       validato.prezzo_child = tipologia.prezzo_child;
    //       validato.prezzo_full = tipologia.prezzo_full
    //       this.validatiPerTipologia.push(validato);


    //     }


    //   })
    //   console.log("🚀 ~ file: chiusura-giornaliera-val.component.ts ~ line 80 ~ ChiusuraGiornalieraValComponent ~ Object.keys ~ this.validatiPerTipologia", this.validatiPerTipologia)
    //  });

  }

  checkChiusura(){
    this.loader.show();
    let lista = [];


    forkJoin([
      this.validatoreService.getAllDistributoriOta(),
      this.validatoreService.chiusuraAlreadyPresent(this.userInfo.id, { data: null}),
      this.validatoreService.bigliettiVendutiGiornalieri(this.userInfo.id),
      this.validatoreService.getBigliettiTimbrati(this.userInfo.id),
      this.validatoreService.getBigliettiWavePerValidatore(this.userInfo.id),
    ]).subscribe(
      ([distributoriOta, chiusuraAlreadyPresent, vendutiGiornalieri, timbrati, wave]) => {

        this.distributoriOta = distributoriOta;

        this.isChiusuraAlreadyPresent = chiusuraAlreadyPresent.present;
        this.idChiusura = this.isChiusuraAlreadyPresent ? chiusuraAlreadyPresent.chiusuraId : null;

        //

        this.nRidotti = 0;
        this.nInteri = 0;
        this.totInteri = 0;
        this.totRidotti = 0;
        this.totContanti = 0;
        this.bigliettiVendutiList = vendutiGiornalieri;
        this.bigliettiVendutiList.forEach(b => {
          this.nRidotti += b.nBigliettiRidotti;
          this.nInteri += b.nBigliettiInteri;
          this.totInteri += b.totInteri;
          this.totRidotti += b.totRidotti;
          if(b.contanti){
            this.totContanti += b.totInteri + b.totRidotti;
          }

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

        //

        this.checkValidati(timbrati);

        // const groupBy = <T, K extends keyof any>(arr: T[], key: (i: T) => K) =>
        // arr.reduce((groups, item) => {
        //   (groups[key(item)] ||= []).push(item);
        //   return groups;
        // }, {} as Record<K, T[]>);

        // let bigliettiArray: any[];
        // bigliettiArray = timbrati;
        // this.totValidati = timbrati.length;
        // let results = groupBy(bigliettiArray, i =>  i.tipologiaBiglietto.id);
        // Object.keys(results).forEach(key => {
        //   let arrayPerTipologia = results[key];
        //   let tipologia = arrayPerTipologia[0].tipologiaBiglietto;


        //   if(arrayPerTipologia[0].distributoreOta != null){

        //     let validatoOta: any = {};
        //     validatoOta.nAdult = [...arrayPerTipologia].filter(x => x.bigliettoFull == true).length;
        //     validatoOta.nChild = [...arrayPerTipologia].filter(x => x.bigliettoFull == false).length;
        //     validatoOta.tipologia = tipologia.titolo;
        //     validatoOta.prezzo_child = tipologia.prezzo_child;
        //     validatoOta.prezzo_full = tipologia.prezzo_full
        //     validatoOta.idOta = arrayPerTipologia[0].distributoreOta;
        //     this.validatiOta.push(validatoOta);
        //     console.log('aooooo', arrayPerTipologia, validatoOta, arrayPerTipologia.filter(x => x.distributoreOta != null) )
        //     // this.validatiOta.push(arrayPerTipologia.filter(x => x.distributoreOta != null));

        //     this.distributoriOta.forEach(distributore => {
        //       if(validatoOta.idOta == distributore.id){
        //         distributore.listaBiglietti = [];
        //         distributore.listaBiglietti.push(validatoOta);
        //       }
        //     });

        //     console.log(this.distributoriOta, 'disdsjosdjsoj')

        //   } else {
        //     let validato: any = {};
        //     console.log('aooooo', arrayPerTipologia)
        //     validato.nAdult = [...arrayPerTipologia].filter(x => x.bigliettoFull == true).length;
        //     validato.nChild = [...arrayPerTipologia].filter(x => x.bigliettoFull == false).length;
        //     validato.tipologia = tipologia.titolo;
        //     validato.prezzo_child = tipologia.prezzo_child;
        //     validato.prezzo_full = tipologia.prezzo_full
        //     this.validatiPerTipologia.push(validato);


        //   }



        // });

        //

        this.validatiVox = wave;
        // this.listOperatori = operatori;
        // this.createForm();
        // this.sistemaAutoCompleteoperatore();

        // this.listaBiglietti = bigliettiDisponibili;
        // this.dataSource = new MatTableDataSource(bigliettiDisponibili)
        // this.filterSettings();
        // this.dataSource.paginator = this.paginator;
        // this.dataSource.sort = this.sort;

        this.loader.hide();

      }
    );

      //   this.validatoreService.chiusuraAlreadyPresent(this.userInfo.id, { data: null}).subscribe(wrapper => {
      //   this.isChiusuraAlreadyPresent = wrapper.present;
      //   this.idChiusura = this.isChiusuraAlreadyPresent ? wrapper.chiusuraId : null;
      // })

    // this.validatoreService.chiusuraAlreadyPresent(this.userInfo.id, { data: null}).pipe(
    //   tap(wrapper => {
    //     this.isChiusuraAlreadyPresent = wrapper.present;
    //     this.idChiusura = this.isChiusuraAlreadyPresent ? wrapper.chiusuraId : null;
    //   }),
    //   switchMap(() => this.validatoreService.bigliettiVendutiGiornalieri(this.userInfo.id))
    //   ).subscribe(
    //       listaBiglietti => {
    //         this.nRidotti = 0;
    //         this.nInteri = 0;
    //         this.totInteri = 0;
    //         this.totRidotti = 0;
    //         this.totContanti = 0;
    //     this.bigliettiVendutiList = listaBiglietti;
    //     this.bigliettiVendutiList.forEach(b => {
    //       console.log(b,'ao');
    //       this.nRidotti += b.nBigliettiRidotti;
    //       this.nInteri += b.nBigliettiInteri;
    //       this.totInteri += b.totInteri;
    //       this.totRidotti += b.totRidotti;
    //       if(b.contanti){
    //         this.totContanti += b.totInteri + b.totRidotti;
    //       }

    //       let isPresent = false;

    //       lista.forEach(el => {
    //         if(el.tipologiaBiglietto.id == b.tipologiaBiglietto.id){
    //           isPresent = true;
    //           el.nBigliettiRidotti += b.nBigliettiRidotti;
    //           el.nBigliettiInteri += b.nBigliettiInteri;
    //           el.totInteri += b.totInteri;
    //           el.totRidotti += b.totRidotti;
    //         }

    //       });

    //       if(!isPresent){
    //         lista.push(b);
    //       }

    //     });
    //     this.bigliettiVendutiList = lista;
    //     this.loader.hide();
    //   })

  }

  backToLand() {
    this.navigation.goToHome();
  }

  downloadChiusura() {
    this.loader.show();
    this.validatoreService.getChiusuraById(this.idChiusura).subscribe(
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
    this.validatoreService.addChiusura(idDistributore, { data: null}).subscribe(
      res => {
        this.checkChiusura();
        this.openSnackBar(res.messaggio,'chiudi');
      }
    )
  }

}
