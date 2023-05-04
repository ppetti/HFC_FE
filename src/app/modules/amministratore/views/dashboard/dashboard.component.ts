import { PieDialogComponent } from './../../components/grafici/dialogs/pie-dialog/pie-dialog.component';
import { Component, OnInit } from '@angular/core';
import { map } from 'rxjs/operators';
import { Breakpoints, BreakpointObserver } from '@angular/cdk/layout';
import { MatDialog } from '@angular/material/dialog';
import { AggiungiBigliettiComponent } from '../../components/aggiungi-biglietti/aggiungi-biglietti.component';
import { TipologiaBigliettoService } from '../../services/tipologia-biglietto.service';
import { AmministratoreApiService } from '../../services/amministratore-api.service';
import { AreaChartDialogComponent } from '../../components/grafici/dialogs/area-chart-dialog/area-chart-dialog.component';
import { forkJoin } from 'rxjs';
import { DettaglioBigliettiDialogComponent } from '../../components/grafici/dialogs/dettaglio-biglietti-dialog/dettaglio-biglietti-dialog.component';
import { DettaglioBigliettiVenditaDialogComponent } from '../../components/grafici/dialogs/dettaglio-biglietti-vendita-dialog/dettaglio-biglietti-vendita-dialog.component';
import { DettaglioVenditoriAttiviDialogComponent } from '../../components/grafici/dialogs/dettaglio-venditori-attivi-dialog/dettaglio-venditori-attivi-dialog.component';
import { DatePipe } from '@angular/common';
import { LoaderService } from './../../../../loader/loader.service';
import { DettaglioOperatoriInterniAttiviDialogComponent } from '../../components/grafici/dialogs/dettaglio-operatori-interni-attivi-dialog/dettaglio-operatori-interni-attivi-dialog.component';
import { DettaglioBigliettiValidatiDialogComponent } from '../../components/grafici/dialogs/dettaglio-biglietti-validati-dialog/dettaglio-biglietti-validati-dialog.component';
import { AuthService } from '../../../../core/services/auth.service';
import { DettaglioBigliettiVendutiToursComponent } from '../../components/grafici/dialogs/dettaglio-biglietti-venduti-tours/dettaglio-biglietti-venduti-tours.component';
import { DettaglioBigliettiValidatiOtaComponent } from '../../components/grafici/dialogs/dettaglio-biglietti-validati-ota/dettaglio-biglietti-validati-ota.component';
import { DettaglioPasseggeriComponent } from '../../components/grafici/dialogs/dettaglio-passeggeri/dettaglio-passeggeri.component';
import { DettaglioBigliettiVenditaReteComponent } from '../../components/grafici/dialogs/dettaglio-biglietti-vendita-rete/dettaglio-biglietti-vendita-rete.component';
import { environment } from '@Src/environments/environment';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  titolo = {
    text: 'Biglietti venduti',
    subtext: 'per macrosettore nel mese corrente',
    x: 'center'
  }

  tooltipStandard = {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  }

  monthNames = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];
  isSpecialCase = false;

  mm: any;
  bigliettiVendutiPerMacro: any[];
  dataList: any[] = [];
  legendData: any[] = [];
  monthStats: any;
  legendStats: any;
  customOption: any;
  validatoriCount: any;
  validatoriList: any[];
  distributoriList: any[];
  distributoriCount: any;
  totaleVenditeCount: any;
  bigliettiCount: any;
  vendutiCount: any;
  validatiCount: any;
  toursCount: any;
  breakpoint: number;
  isSupervisore: any;
  otaCount: any;
  validatiDaReteVenditoriCount: any;
  passeggeriDaVenduti:any;
  passeggeriOta: any;
  toursCountPasseggeri: any;

  options: any;

  listaDate= [];
  listaBigliettiVenduti= [];
  listaBigliettiValidati= [];
  listaVendutiValidati= [];

  constructor(
    private breakpointObserver: BreakpointObserver,
    public dialog: MatDialog,
    private tipologiaService: TipologiaBigliettoService,
    private amministratoreService: AmministratoreApiService,
    private datePipe: DatePipe,
    private loader: LoaderService,
	private auth: AuthService
  ) {
  }
  removeHoursToDate(date: Date, hours: number): Date { //QUESTA FUNZIONE TOGLIE LE ORE DAI FORMATI DATE E RESTITUISCE UNA DATA INDIETRO NEL TEMPO IN BASE A QUANTE ORE GLI VENGONO PASSATE
    return new Date(new Date(date).setHours(date.getHours() - hours));
  }
  //QUESTA FUNZIONE SERVE A COMPARARE UNA LISTA DI BIGLIETTI VENDUTI IN UN DEFINITO INTERVALLO DI TEMPO E A METTERE I DATI SU GRAFICO, I VALORI PRIMA DEL WRAPPER SONO FATTI IN QUESTO MODO PER RENDERE LA FUNZIONE DINAMICA NEL CASO IL CLIENTE VOGLIA CAMBIARE FINESTRA DI TEMPO

  ricercaBiglietti(wrapper: any, oreInSettimana, settimaneDaOsservare, intervalloSettimana){

    let wrapperRete = {
      dataDa: wrapper.dataA,
      dataA: wrapper.dataA,
      oraDa: wrapper.oraDa,
      oraA: wrapper.oraA,
      tipologiaBigliettoList: wrapper.tipologiaBigliettoList
    }
    forkJoin([
      this.amministratoreService.getAllBigliettiVendutiValidatiDataFiltrati(wrapper),
      this.amministratoreService.getBigliettiVendutiPerTipologiaFiltrati(wrapper),
      this.amministratoreService.getAllBigliettiVendutiValidatiReteDataFiltrati(wrapperRete),
      this.amministratoreService.getBigliettiValidatiWave(wrapper),
    ]).subscribe(
      ([validatiResponse, vendutiResponse, validatiDaReteVenditori, validatiWaveList]) => {
        let ore = 1008
        this.listaDate = [];
        this.listaVendutiValidati = [];
          for(let i = 0; i <= 42; i++){


          this.listaDate.push(this.datePipe.transform(this.removeHoursToDate(new Date(), ore), "dd/MM/yyyy"));
          ore = ore - 24;

          let numeroBiglietti = 0;

            validatiResponse.forEach(el => {

              let giorno = new Date();
              if (environment.settings.dataCambioCalcoloPasseggeri) {
                const dateString = environment.settings.dataCambioCalcoloPasseggeri;
                const dateParts = dateString.split('-');
                const dateObject = new Date(parseInt(dateParts[2]), parseInt(dateParts[1]) - 1, parseInt(dateParts[0]));
                if (new Date(el.validato) < dateObject) {
                  this.isSpecialCase = true;
                } else {
                  this.isSpecialCase = false;
                }
              }

              if (this.isSpecialCase) {

              if(new Date(el.validato) >= this.removeHoursToDate(new Date(giorno.setHours(0,0,0)),ore + 24) && new Date(el.validato) <= this.removeHoursToDate(new Date(giorno.setHours(0,0,0)),ore) && el.isCartaceo){
                if(el.tipologiaBiglietto.passeggeriPerBiglietto ){
                  //TODO: rimuovere questo if-else è stato utilizzato soltanto per colmare la differenza nei passeggeri giornalieri, è a tutti gli effetti un bug sul conteggio dei passeggeri totali
                  if(el.distributoreOta) {
                    numeroBiglietti = numeroBiglietti + (el.tipologiaBiglietto.passeggeriPerBiglietto*2);
                  } else {
                    numeroBiglietti = numeroBiglietti + el.tipologiaBiglietto.passeggeriPerBiglietto;
                  }
                } else {
                  //TODO: rimuovere questo if-else è stato utilizzato soltanto per colmare la differenza nei passeggeri giornalieri, è a tutti gli effetti un bug sul conteggio dei passeggeri totali
                  if(el.distributoreOta) {
                    numeroBiglietti = numeroBiglietti + 2;
                  } else {
                  numeroBiglietti = numeroBiglietti + 1;
                  }
                }

              }
            } else {
              if (new Date(el.validato) >= this.removeHoursToDate(new Date(giorno.setHours(0, 0, 0)), ore + 24) && new Date(el.validato) <= this.removeHoursToDate(new Date(giorno.setHours(0, 0, 0)), ore) && el.isCartaceo) {
                if (el.tipologiaBiglietto.passeggeriPerBiglietto) {
                  numeroBiglietti = numeroBiglietti + el.tipologiaBiglietto.passeggeriPerBiglietto;
                } else {
                  numeroBiglietti = numeroBiglietti + 1;
                }
              }
            }
            });


            vendutiResponse.forEach(elem => {

            let giorno = new Date();

              if(new Date(elem.data) >= this.removeHoursToDate(new Date(giorno.setHours(0,0,0)),ore + 24) && new Date(elem.data) <= this.removeHoursToDate(new Date(giorno.setHours(0,0,0)),ore)){

                if(elem.tipologiaBiglietto.passeggeriPerBiglietto){
                  numeroBiglietti = numeroBiglietti + elem.tipologiaBiglietto.passeggeriPerBiglietto * (elem.nBigliettiInteri + elem.nBigliettiRidotti);
                } else {
                  numeroBiglietti = numeroBiglietti + elem.nBigliettiInteri + elem.nBigliettiRidotti;
                }
              }
            });

            validatiWaveList.forEach(el => {

              let giorno = new Date();

              if(new Date(el.dataEmissione) >= this.removeHoursToDate(new Date(giorno.setHours(0,0,0)),ore + 24) && new Date(el.dataEmissione) <= this.removeHoursToDate(new Date(giorno.setHours(0,0,0)),ore)){

                    numeroBiglietti = numeroBiglietti + 1;

              }

            });

            this.listaVendutiValidati.push(numeroBiglietti);

        }

        this.validatiDaReteVenditoriCount = 0;

        validatiDaReteVenditori.forEach(el => {
          if(el.prezzoValidazione != null || el.prezzoValidazione >0){
            this.validatiDaReteVenditoriCount = this.validatiDaReteVenditoriCount + el.prezzoValidazione;
          } else {
            if(el.bigliettoFull){
              this.validatiDaReteVenditoriCount = this.validatiDaReteVenditoriCount + el.tipologiaBiglietto.prezzo_full;
            } else {
              this.validatiDaReteVenditoriCount = this.validatiDaReteVenditoriCount + el.tipologiaBiglietto.prezzo_child;

            }

          }
        });

        this.options = {
          // Make gradient line here
          visualMap: [
            {
              show: false,
              type: 'continuous',
              seriesIndex: 0,
              min: 0,
              max: 99999
            }
          ],

            title: [
              {
                left: 'center',
                text: 'Passeggeri giornalieri'
              }
            ],
            tooltip: {
              trigger: 'axis'
            },
            xAxis: [
              {
                data: this.listaDate
              }
            ],
            yAxis: [
              {},
            ],
            grid: [
              {
                bottom: '60%'
              },
              {
                top: '60%'
              }
            ],
            series: [
              {
                type: 'line',
                showSymbol: false,
                data: this.listaVendutiValidati,
                lineStyle: {color: '#6841e0'}
              }
            ]
          };
          this.loader.hide();
      })
  }



  ngOnInit() {

    this.breakpoint = (window.innerWidth <= 700) ? 1 : (window.innerWidth >= 700) && (window.innerWidth <= 900) ? 2 : 4;
    this.loader.show();
    this.calculateCounters();
	this.isSupervisore = this.auth.isSupervisore();
    let today = this.getTodayDate();
    let todayDate = {
      'data': today
    }
    this.amministratoreService.getBigliettiVendutiPerMacrosettore(todayDate).subscribe(
      bigliettiVendutilist => {
        this.bigliettiVendutiPerMacro = bigliettiVendutilist;
        let flag = true;

        this.bigliettiVendutiPerMacro.forEach(x => {
          if(x.numeroBigliettiVenduti > 0){
            flag = false;
            let obj = {
              value: x.numeroBigliettiVenduti,
              name: x.nomeMacrosettore
            }
            this.dataList.push(obj);
            this.legendData.push(x.nomeMacrosettore);
          }
        });

        if(flag){
          let obj = {
            value: 0,
            name: "Nessun biglietto venduto"
          }

          this.dataList.push(obj);
          this.legendData.push("Nessun biglietto venduto");
        }

        //series
        this.monthStats = {
          name: this.monthNames[this.mm - 1],
          type: 'pie',
          radius: '50%',
          data: this.dataList
        }

        //legend
        this.legendStats = {
          x: 'center',
          y: 'bottom',
          // data: this.legendData
        }

        this.customOption = {
          title: this.titolo,
          tooltip: this.tooltipStandard,
          // legend: this.legendStats,
          calculable: true,
          series: this.monthStats
        }
      }
    )

    this.amministratoreService.getAllTipologieBigliettoDimensionale().subscribe(
      tipologieList => {

        // I VALORI PRIMA DEL WRAPPER SONO FATTI IN QUESTO MODO PER RENDERE LA FUNZIONE DINAMICA NEL CASO IL CLIENTE VOGLIA CAMBIARE FINESTRA DI TEMPO
        let oreInSettimana = 168;
        let settimaneDaOsservare = 6;
        let intervalloSettimana = (oreInSettimana * settimaneDaOsservare);

        let wrapper = {
          dataDa: this.removeHoursToDate(new Date(), intervalloSettimana - 1), //RIMUOVO 1 PER COMPENSARE L'ORARIO STANDARD DI DATE CHE NON E' QUELLO ITALIANO
          dataA: this.removeHoursToDate(new Date(), - 1),
          oraDa: 0,
          oraA: 23,
          tipologiaBigliettoList: tipologieList
        }



        this.ricercaBiglietti(wrapper, oreInSettimana, settimaneDaOsservare, intervalloSettimana);
      }
    )
  }

  onResize(event) {
    this.breakpoint = (event.target.innerWidth <= 700) ? 1 : (window.innerWidth >= 700) && (window.innerWidth <= 900) ? 2 : 4;
  }

  getTodayDate() {
    let date: Date = new Date();
    let dd = date.getDate();
    this.mm = date.getMonth() + 1;
    let mm = this.mm;
    let yyyy = date.getFullYear();
    mm = mm < 10 ? '0' + mm : mm;
    let day = dd < 10 ? '0' + dd : dd;
    let today = yyyy + '-' + mm + '-' + day;
    return today;
  }

  addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() - hours));
  }

  calculateCounters() {
    forkJoin([
      this.amministratoreService.getOperatoriAttivi(this.datePipe.transform(this.addHoursToDate(new Date(), 338), "dd/MM/yyyy"), this.datePipe.transform(new Date(), "dd/MM/yyyy"), true),
      // this.amministratoreService.getAllDistributori(),
      this.amministratoreService.getVenditoriAttivi(this.datePipe.transform(this.addHoursToDate(new Date(), 338), "dd/MM/yyyy"), this.datePipe.transform(new Date(), "dd/MM/yyyy"), true),
      this.amministratoreService.getAllBigliettiVendutiData(),
      this.amministratoreService.getVendutiValidati(),
      this.amministratoreService.getAllBigliettiVendutiTour24(),
	  this.amministratoreService.getAllBigliettiValidatiOta()
    ]).subscribe(
      ([validatori, distributori, wrapper, vendutiValidati, tours, ota]) => {
        this.validatoriList = validatori;
        this.validatoriCount = this.validatoriList.length;
        this.distributoriList = distributori;
        this.toursCount = tours.bigliettiVenduti;
        this.distributoriCount = this.distributoriList.length;
        // this.bigliettiCount = wrapper.bigliettiVendutiValidati;
        this.passeggeriDaVenduti = wrapper.passeggeriDaVenduti;
        this.bigliettiCount = wrapper.bigliettiVenduti;
        this.totaleVenditeCount = wrapper.totaleVendite;
        this.toursCountPasseggeri = tours.passeggeriDaVenduti;
        this.vendutiCount = this.toursCountPasseggeri + this.passeggeriDaVenduti;
        this.validatiCount = vendutiValidati?.validati; // TODO: Questo già li ritorna tutti ed è ok ma bisogna raggrupparli per distributore assegnato/ota assegnato
		    this.otaCount = ota.validati;
        this.passeggeriOta = ota?.passeggeri; //TODO: da fare in modo che questo ritorni solo i vox e non gli altri ota
      }
    )
  }

  cards = this.breakpointObserver.observe(Breakpoints.Handset).pipe(
    map(({ matches }) => {
      if (matches) {
        return [
          { title: 'Card 1', cols: 1, rows: 1, content: 'pie' },
          { title: 'Card 3', cols: 1, rows: 1, content: 'area' }
          // { title: 'Card 4', cols: 1, rows: 2, content: 'biglietti' }
        ];
      }

      return [

        { title: 'Card 1', cols: 1, rows: 1, content: 'pie' },
        { title: 'Card 2', cols: 2, rows: 1, content: 'area' }
        // { title: 'Card 4', cols: 1, rows: 2, content: 'biglietti' }
      ];
    })
  );

  counters = this.breakpointObserver.observe([Breakpoints.XSmall, Breakpoints.Small, Breakpoints.Tablet]).pipe(
    map(({ matches }) => {
      if (matches) {

        return [
          { title: 'Card 6', cols: 1, rows: 1, content: 'passeggeri' },
          { title: 'Card 1', cols: 1, rows: 1, content: 'biglietti-venduti' },
          { title: 'Card 2', cols: 1, rows: 1, content: 'distributori' },
          { title: 'Card 3', cols: 1, rows: 1, content: 'validatori' },
          { title: 'Card 4', cols: 1, rows: 1, content: 'biglietti-venduti-prezzo-custom' },
          { title: 'Card 5', cols: 1, rows: 1, content: 'guadagni' },
          { title: 'Card 7', cols: 1, rows: 1, content: 'tours' },
		  { title: 'Card 8', cols: 1, rows: 1, content: 'dist_ota' },

        ]
      }

      return [
        { title: 'Card 6', cols: 1, rows: 1, content: 'passeggeri' },
        { title: 'Card 1', cols: 1, rows: 1, content: 'biglietti-venduti' },
        { title: 'Card 2', cols: 1, rows: 1, content: 'distributori' },
        { title: 'Card 3', cols: 1, rows: 1, content: 'validatori' },
        { title: 'Card 4', cols: 1, rows: 1, content: 'biglietti-venduti-prezzo-custom' },
        { title: 'Card 5', cols: 1, rows: 1, content: 'guadagni' },
        { title: 'Card 7', cols: 1, rows: 1, content: 'tours' },
        { title: 'Card 8', cols: 1, rows: 1, content: 'dist_ota' },

      ];
    })
  );



  openDialog(chart) {



    if (chart === 'dettaglioBiglietti') {
      const dialogRef = this.dialog.open(DettaglioBigliettiDialogComponent, {
        panelClass: 'full-screen-dialog',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    if (chart === 'dettaglioBigliettiVendita') {
      const dialogRef = this.dialog.open(DettaglioBigliettiVenditaDialogComponent, {
        panelClass: 'full-screen-dialog',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    if (chart === 'dettaglioBigliettoVenditaPrezzoCustom') {
      const dialogRef = this.dialog.open(DettaglioBigliettiVenditaReteComponent, {
        panelClass: 'full-screen-dialog',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    if (chart === 'dettaglioVenditoriAttivi') {
      const dialogRef = this.dialog.open(DettaglioVenditoriAttiviDialogComponent, {
        panelClass: 'full-screen-dialog',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    if (chart === 'dettaglioOperatoriAttivi') {
      const dialogRef = this.dialog.open(DettaglioOperatoriInterniAttiviDialogComponent, {
        panelClass: 'full-screen-dialog',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    if (chart === 'dettaglioValidati') {
      const dialogRef = this.dialog.open(DettaglioBigliettiValidatiDialogComponent, {
        panelClass: 'full-screen-dialog',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    if (chart === 'tours') {
      const dialogRef = this.dialog.open(DettaglioBigliettiVendutiToursComponent, {
        panelClass: 'full-screen-dialog',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    if (chart === 'pie') {
      const dialogRef = this.dialog.open(PieDialogComponent, {
        panelClass: 'full-screen-dialog',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    if (chart === 'stacked-area') {
      const dialogRef = this.dialog.open(AreaChartDialogComponent, {
        panelClass: 'full-screen-dialog',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }

    if (chart === 'dist_ota') {
      const dialogRef = this.dialog.open(DettaglioBigliettiValidatiOtaComponent, {
        panelClass: 'full-screen-dialog',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });
    }


    if (chart === 'dettaglioPasseggeri') {
      const dialogRef = this.dialog.open(DettaglioPasseggeriComponent, {
        panelClass: 'full-screen-dialog',
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log(`Dialog result: ${result}`);
      });

    }

  }

  openBigliettiDialog() {
    const dialogRef = this.dialog.open(AggiungiBigliettiComponent, {
      panelClass: 'full-screen-dialog',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.tipologiaService.showTipologiaBiglietto();
    });
  }
}
