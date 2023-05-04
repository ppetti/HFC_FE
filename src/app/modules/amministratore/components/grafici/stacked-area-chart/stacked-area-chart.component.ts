import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, Input, OnInit, OnChanges } from '@angular/core';
import { AmministratoreApiService } from '../../../services/amministratore-api.service';

@Component({
  selector: 'app-stacked-area-chart',
  templateUrl: './stacked-area-chart.component.html',
  styleUrls: ['./stacked-area-chart.component.scss']
})
export class StackedAreaChartComponent implements OnChanges{

  //@Input() series;
  @Input() options;
  @Input() dialog;
  chartInstance;

  isLoading = false;
  listaDate= [];
  listaBiglietti= [];



  constructor(
  ) { }


  ngOnChanges() {
    console.log('CHANGES!', this.options)
    // if(this.series) {
    //   this.options.series = this.series;
    //   this.chartInstance ? this.chartInstance.setOption(this.options) : null;
    // }
  }

  //QUESTA FUNZIONE SERVE A COMPARARE UNA LISTA DI BIGLIETTI VENDUTI IN UN DEFINITO INTERVALLO DI TEMPO E A METTERE I DATI SU GRAFICO, I VALORI PRIMA DEL WRAPPER SONO FATTI IN QUESTO MODO PER RENDERE LA FUNZIONE DINAMICA NEL CASO IL CLIENTE VOGLIA CAMBIARE FINESTRA DI TEMPO


  onChartInit(ec) {
    console.log("🚀 ~ file: pie-dialog.component.ts ~ line 52 ~ PieDialogComponent ~ onChartInit ~ ec", ec)
    this.chartInstance = ec;
  }
}
