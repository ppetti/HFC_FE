import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from '@Src/app/modules/amministratore/services/amministratore-api.service';
import { environment } from '@Src/environments/environment';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-area-chart-dialog',
  templateUrl: './area-chart-dialog.component.html',
  styleUrls: ['./area-chart-dialog.component.scss']
})
export class AreaChartDialogComponent implements OnInit {

  options: any;

  isLoading = true;
  listaDate = [];
  listaBiglietti = [];
  selectedOption;
  sortedMonths: string[] = [];
  months: string[] = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];
  mm: any;
  today;
  tipologieBiglietti = [];
  listaVendutiValidati = [];
  isSpecialCase = false;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private datePipe: DatePipe,
    private changeDetector: ChangeDetectorRef,
    private loader: LoaderService,
  ) { }

  removeHoursToDate(date: Date, hours: number): Date { //QUESTA FUNZIONE TOGLIE LE ORE DAI FORMATI DATE E RESTITUISCE UNA DATA INDIETRO NEL TEMPO IN BASE A QUANTE ORE GLI VENGONO PASSATE, E' USATA OCCASIONALMENTE PER AGGIUNGERE ORE A SECONDA DEL SEGNO CHE GLI VIENE PASSATO COME PARAMETRO
    return new Date(new Date(date).setHours(date.getHours() - hours));
  }

  ngOnInit(): void {
    this.loader.show();
    this.getTodayDate();
    this.sortMonths();

    this.amministratoreService.getAllTipologieBigliettoDimensionale().subscribe(
      tipologieList => {

        this.tipologieBiglietti = tipologieList;

        // I VALORI PRIMA DEL WRAPPER SONO FATTI IN QUESTO MODO PER RENDERE LA FUNZIONE DINAMICA NEL CASO IL CLIENTE VOGLIA CAMBIARE FINESTRA DI TEMPO
        let oreInSettimana = 168;
        let settimaneDaOsservare = 6;
        let intervalloSettimana = (oreInSettimana * settimaneDaOsservare) + oreInSettimana;

        let wrapper = {
          dataDa: this.removeHoursToDate(new Date(), intervalloSettimana - 1), //RIMUOVO 1 PER COMPENSARE L'ORARIO STANDARD DI DATE CHE NON E' QUELLO ITALIANO
          dataA: this.removeHoursToDate(new Date(), - 1),
          oraDa: 0,
          oraA: 23,
          tipologiaBigliettoList: tipologieList
        }



        this.ricercaBiglietti(wrapper);
      }
    )

  }

  //QUESTA FUNZIONE SERVE A COMPARARE UNA LISTA DI BIGLIETTI VENDUTI IN UN DEFINITO INTERVALLO DI TEMPO E A METTERE I DATI SU GRAFICO, I VALORI PRIMA DEL WRAPPER SONO FATTI IN QUESTO MODO PER RENDERE LA FUNZIONE DINAMICA NEL CASO IL CLIENTE VOGLIA CAMBIARE FINESTRA DI TEMPO

  ricercaBiglietti(wrapper: any) {
    forkJoin([
      this.amministratoreService.getAllBigliettiVendutiValidatiDataFiltrati(wrapper),
      this.amministratoreService.getBigliettiVendutiPerTipologiaFiltrati(wrapper),
      this.amministratoreService.getBigliettiValidatiWave(wrapper),
    ]).subscribe(
      ([validatiResponse, vendutiResponse, validatiWaveList]) => {
        let ore = 1008
        this.listaDate = [];
        this.listaVendutiValidati = [];

        for (let i = 0; i <= 42; i++) {


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
              if (new Date(el.validato) >= this.removeHoursToDate(new Date(giorno.setHours(0, 0, 0)), ore + 24) && new Date(el.validato) <= this.removeHoursToDate(new Date(giorno.setHours(0, 0, 0)), ore) && el.isCartaceo) {
                if (el.tipologiaBiglietto.passeggeriPerBiglietto) {
                  //TODO: rimuovere questo if-else è stato utilizzato soltanto per colmare la differenza nei passeggeri giornalieri, è a tutti gli effetti un bug sul conteggio dei passeggeri totali
                  if (el.distributoreOta) {
                    numeroBiglietti = numeroBiglietti + (el.tipologiaBiglietto.passeggeriPerBiglietto * 2);
                  } else {
                    numeroBiglietti = numeroBiglietti + el.tipologiaBiglietto.passeggeriPerBiglietto;
                  }
                } else {
                  //TODO: rimuovere questo if-else è stato utilizzato soltanto per colmare la differenza nei passeggeri giornalieri, è a tutti gli effetti un bug sul conteggio dei passeggeri totali
                  if (el.distributoreOta) {
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


          vendutiResponse.forEach(el => {

            let giorno = new Date();

            if (new Date(el.data) >= this.removeHoursToDate(new Date(giorno.setHours(0, 0, 0)), ore + 24) && new Date(el.data) <= this.removeHoursToDate(new Date(giorno.setHours(0, 0, 0)), ore)) {
              if (el.tipologiaBiglietto.passeggeriPerBiglietto) {
                numeroBiglietti = numeroBiglietti + el.tipologiaBiglietto.passeggeriPerBiglietto * (el.nBigliettiInteri + el.nBigliettiRidotti);
              } else {
                numeroBiglietti = numeroBiglietti + el.nBigliettiInteri + el.nBigliettiRidotti;
              }
            }
          });


          validatiWaveList.forEach(el => {

            let giorno = new Date();

            if (new Date(el.dataEmissione) >= this.removeHoursToDate(new Date(giorno.setHours(0, 0, 0)), ore + 24) && new Date(el.dataEmissione) <= this.removeHoursToDate(new Date(giorno.setHours(0, 0, 0)), ore)) {

              numeroBiglietti = numeroBiglietti + 1;

            }

          });


          this.listaVendutiValidati.push(numeroBiglietti);

        }

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
              lineStyle: { color: '#6841e0' }
            }
          ]
        };
        this.loader.hide();
      })
  }


  onNgModelChange(value) {
    this.loader.show();
    let i = 0;
    let trovato = false;
    while (i < 12 && !trovato) {
      this.months[i] == value ? trovato = true : i++;
    }
    let anno: any;
    if (i > this.mm - 1) {
      anno = (this.today.slice(0, 4)) as number;
      anno = anno - 1;
    } else {
      anno = this.today.slice(0, 4);
    }
    i++;
    let j = i < 10 ? '0' + i : i;
    let date = {
      'data': anno + "-" + (j) + "-01"
    }
    this.findDataMacro(date, i);
  }

  findDataMacro(date, monthNum) {

    let today = new Date();
    let dataDa = new Date(today.getFullYear(), monthNum - 1, 1);
    let dataA = new Date(today.getFullYear(), monthNum, 0);

    // console.log('nuovadata',dataA, dataDa)

    let oreInSettimana = 168;
    let settimaneDaOsservare = 4;
    let intervalloSettimana = (oreInSettimana * settimaneDaOsservare) + oreInSettimana;

    let wrapper = {
      dataDa: this.removeHoursToDate(dataDa, - 1),
      dataA: this.removeHoursToDate(dataA, - 24),
      oraDa: 0,
      oraA: 23,
      tipologiaBigliettoList: this.tipologieBiglietti
    }



    this.ricercaBigliettiMese(wrapper, oreInSettimana, settimaneDaOsservare, intervalloSettimana);

  }

  sortMonths() {
    let firstTemp: string[] = [];
    for (let i = 0; i < this.mm; i++) {
      firstTemp.push(this.months[i]);
    }
    let secondTemp: string[] = [];
    for (let i = this.mm; i < 12; i++) {
      secondTemp.push(this.months[i]);
    }
    this.sortedMonths = secondTemp.concat(firstTemp);
  }

  getTodayDate() {
    let date: Date = new Date();
    let dd = date.getDate();
    this.mm = date.getMonth() + 1;
    let mm = this.mm;
    let yyyy = date.getFullYear();
    mm = mm < 10 ? '0' + mm : mm;
    let day = dd < 10 ? '0' + dd : dd;
    this.today = yyyy + '-' + mm + '-' + day;
  }

  ricercaBigliettiMese(wrapper: any, oreInSettimana, settimaneDaOsservare, intervalloSettimana) {

    forkJoin([
      this.amministratoreService.getAllBigliettiVendutiValidatiDataFiltrati(wrapper),
      this.amministratoreService.getBigliettiVendutiPerTipologiaFiltrati(wrapper),
      this.amministratoreService.getBigliettiValidatiWave(wrapper),
    ]).subscribe(
      ([validatiResponse, vendutiResponse, validatiWaveList]) => {

        //QUESTO CODICE SERVE AD OTTENERE LE ORE DA AGGIUNGERE ALL'ULTIMA SETTIMANA DEL MESE PER VIA DEI GIORNI EXTRA NELLA DIVISIONE PER 4 IN UN MESE
        // let tempoExtraDaCalc = this.removeHoursToDate(wrapper.dataA, oreInSettimana * settimaneDaOsservare);
        // let copiaAppoggio = wrapper.dataA;
        // let giorniDelMese = 0;


        // while (copiaAppoggio.getMonth() == wrapper.dataA.getMonth()){
        //   copiaAppoggio = this.removeHoursToDate(copiaAppoggio,- 24);
        //   giorniDelMese += 1;

        // }

        // console.log('aoooooooo',giorniDelMese, wrapper )
        // wrapper.dataA = this.removeHoursToDate(wrapper.dataA, giorniDelMese);

        let ore = new Date(wrapper.dataA.getFullYear(), wrapper.dataA.getMonth(), 0).getDate() * 24;

        // console.log(ore, new Date(wrapper.dataA.getFullYear(), wrapper.dataA.getMonth(), 0).getDate())


        this.listaDate = [];
        this.listaVendutiValidati = [];
        for (let i = 0; i <= new Date(wrapper.dataA.getFullYear(), wrapper.dataA.getMonth(), 0).getDate(); i++) {

          this.listaDate.push(this.datePipe.transform(this.removeHoursToDate(new Date(wrapper.dataA), ore), "dd/MM/yyyy"));
          ore = ore - 24;

          //console.log(this.datePipe.transform(this.removeHoursToDate(new Date(wrapper.dataA),ore),"dd/MM/yyyy"))

          let numeroBiglietti = 0;

          validatiResponse.forEach(el => {

            let giorno = new Date();

            if (new Date(el.validato) >= this.removeHoursToDate(new Date(wrapper.dataA.setHours(0, 0, 0)), ore + 24) && new Date(el.validato) <= this.removeHoursToDate(new Date(wrapper.dataA.setHours(0, 0, 0)), ore) && el.isCartaceo) {
              if (el.tipologiaBiglietto.passeggeriPerBiglietto) {
                numeroBiglietti = numeroBiglietti + el.tipologiaBiglietto.passeggeriPerBiglietto;
              } else {
                numeroBiglietti = numeroBiglietti + 1;
              }
            }
          });


          vendutiResponse.forEach(el => {

            let giorno = new Date();

            if (new Date(el.data) >= this.removeHoursToDate(new Date(wrapper.dataA.setHours(0, 0, 0)), ore + 24) && new Date(el.data) <= this.removeHoursToDate(new Date(wrapper.dataA.setHours(0, 0, 0)), ore)) {
              if (el.tipologiaBiglietto.passeggeriPerBiglietto) {
                numeroBiglietti = numeroBiglietti + el.tipologiaBiglietto.passeggeriPerBiglietto * (el.nBigliettiInteri + el.nBigliettiRidotti);
              } else {
                numeroBiglietti = numeroBiglietti + el.nBigliettiInteri + el.nBigliettiRidotti;
              }
            }
          });

          validatiWaveList.forEach(el => {

            let giorno = new Date();

            if (new Date(el.dataEmissione) >= this.removeHoursToDate(new Date(giorno.setHours(0, 0, 0)), ore + 24) && new Date(el.dataEmissione) <= this.removeHoursToDate(new Date(giorno.setHours(0, 0, 0)), ore)) {

              numeroBiglietti = numeroBiglietti + 1;

            }

          });

          this.listaVendutiValidati.push(numeroBiglietti);

        }

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
              lineStyle: { color: '#6841e0' }
            }
          ]
        };
        this.loader.hide();
      })
  }

}
