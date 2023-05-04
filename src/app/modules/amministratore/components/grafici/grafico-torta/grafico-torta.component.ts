import { Component, Input, OnChanges, OnInit } from '@angular/core';

@Component({
  selector: 'app-grafico-torta',
  templateUrl: './grafico-torta.component.html',
  styleUrls: ['./grafico-torta.component.scss']
})
export class GraficoTortaComponent implements OnChanges {

  @Input() series;
  @Input() options;
  chartInstance;

  constructor() { }

  ngOnChanges() {
    console.log('CHANGES! PIE', this.options)
    if(this.series) {
      this.options.series = this.series;
      this.chartInstance ? this.chartInstance.setOption(this.options) : null;
    }
  }

  onChartInit(ec) {
    console.log("🚀 ~ file: pie-dialog.component.ts ~ line 52 ~ PieDialogComponent ~ onChartInit ~ ec", ec)
    this.chartInstance = ec;
  }

  theme: string;
  // options = {
  //   title: {
  //     text: 'Biglietti venduti',
  //     subtext: 'per macrosettore',
  //     x: 'center'
  //   },
  //   tooltip: {
  //     trigger: 'item',
  //     formatter: '{a} <br/>{b} : {c} ({d}%)'
  //   },
  //   legend: {
  //     x: 'center',
  //     y: 'bottom',
  //     data: ['test', 'test2', 'test3', 'test4', 'test5']
  //   },
  //   calculable: true,
  //   series: []
  // };

}
