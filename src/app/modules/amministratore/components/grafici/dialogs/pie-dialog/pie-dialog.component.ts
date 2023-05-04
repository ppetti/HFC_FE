import { Component, ElementRef, OnInit, ViewChild, ViewChildren } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from '@Src/app/modules/amministratore/services/amministratore-api.service';

@Component({
  selector: 'app-pie-dialog',
  templateUrl: './pie-dialog.component.html',
  styleUrls: ['./pie-dialog.component.scss']
})
export class PieDialogComponent implements OnInit {

  titoloMacro = {
    text: 'Biglietti venduti',
    subtext: 'per macrosettore',
    x: 'left'
  }

  titoloTipo = {
    text: 'Biglietti venduti',
    subtext: 'per macrosettore',
    x: 'left'
  }

  tooltipStandard = {
    trigger: 'item',
    formatter: '{a} <br/>{b} : {c} ({d}%)'
  }

  months: string[] = [
    "Gennaio", "Febbraio", "Marzo", "Aprile", "Maggio", "Giugno",
    "Luglio", "Agosto", "Settembre", "Ottobre", "Novembre", "Dicembre"
  ];

  bigliettiVendutiPerMacro: any[];
  bigliettiVendutiPerTipo: any[];
  dataList: any[] = [];
  legendData: any[] = [];
  sortedMonths: string[] = [];
  monthStats;
  legendStats;

  customOption: any;

  mockToSend;
  mm: any;
  isChecked = false;
  selectedOption;
  today;
  macrosettori;
  formMacro: FormGroup;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private fb: FormBuilder,
    private loader: LoaderService,
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.getTodayDate();
    this.sortMonths();
    this.amministratoreService.getAllMacrosettori().subscribe(
      macroList => {
        this.macrosettori = macroList;
        this.createForm();
        this.loader.hide();
      }
    )
    this.slideChange(false);
  }

  createForm() {
    this.formMacro = this.fb.group({
      mese : [this.sortedMonths[11]],
      macrosettoreList : [this.macrosettori]
    })
  }

  submit() {
    this.loader.show();
    let i = 0;
    let trovato = false;
    while(i < 12 && !trovato ) {
      this.months[i] == this.formMacro.value.mese ? trovato = true : i++;
    }
    let anno: any;
    if (i > this.mm -1) {
      anno = (this.today.slice(0, 4)) as number;
      anno = anno - 1;
    } else {
      anno = this.today.slice(0, 4);
    }
    i++;
    let j = i < 10 ? '0'+i : i;
    let wrapper = {
      'data': anno + "-" + (j) + "-01",
      macrosettoreList : this.formMacro.value.macrosettoreList

    }
    let mese = this.formMacro.value.mese;
    this.amministratoreService.getBigliettiVendutiPerTipologia(wrapper).subscribe(
      bigliettiVendutilist => {
        this.bigliettiVendutiPerTipo = bigliettiVendutilist;
        this.legendData = [];
        this.dataList = [];
        this.customOption = null;
        let flag = true;
        this.bigliettiVendutiPerTipo.forEach(x => {

          if(x.numeroBigliettiVenduti > 0){
            flag = false;
            let obj = {
              value: x.numeroBigliettiVenduti,
              name: x.nomeTipologia
            }
            this.dataList.push(obj);
            this.legendData.push(x.nomeTipologia);
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
          name: mese,
          type: 'pie',
          radius: '80%',
          data: this.dataList
        }

        //legend
        this.legendStats = {
          x: 'center',
          y: 'bottom',
          data: this.legendData
        }

        this.customOption = {
          title: this.titoloTipo,
          tooltip: this.tooltipStandard,
          // legend: this.legendStats,
          calculable: true,
          series: this.monthStats
        }
        this.loader.hide();
      })
  }

  onNgModelChange(value) {
    this.loader.show();
    let i = 0;
    let trovato = false;
    while(i < 12 && !trovato ) {
      this.months[i] == value ? trovato = true : i++;
    }
    let anno: any;
    if (i > this.mm -1) {
      anno = (this.today.slice(0, 4)) as number;
      anno = anno - 1;
    } else {
      anno = this.today.slice(0, 4);
    }
    i++;
    let j = i < 10 ? '0'+i : i;
    let date = {
      'data': anno + "-" + (j) + "-01"
    }
    this.findDataMacro(date, i);
  }

  sortMonths() {
    let firstTemp: string[] = [];
    for(let i = 0; i < this.mm; i++) {
      firstTemp.push(this.months[i]);
    }
    let secondTemp: string[] = [];
    for(let i = this.mm; i < 12; i ++) {
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
    let day  = dd< 10 ? '0' + dd : dd;
    this.today = yyyy  + '-' + mm + '-' + day;
  }

  findDataMacro(date, monthNum) {
    this.amministratoreService.getBigliettiVendutiPerMacrosettore(date).subscribe(
      bigliettiVendutilist => {
        this.bigliettiVendutiPerMacro = bigliettiVendutilist;
        this.legendData = [];
        this.dataList = [];
        this.customOption = null;
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
          name: this.months[monthNum-1],
          type: 'pie',
          radius: '80%',
          data: this.dataList
        }

        //legend
        this.legendStats = {
          x: 'center',
          y: 'bottom',
          data: this.legendData
        }

        this.customOption = {
          title: this.titoloMacro,
          tooltip: this.tooltipStandard,
          // legend: this.legendStats,
          calculable: true,
          series: this.monthStats
        }
        this.loader.hide();
      })
  }

  compareById( a, b ) : boolean {
    return a && b && a.id === b.id;
  }

  compareByName( a, b ) : boolean {
    return a && b && a === b;
  }

  slideChange(value) {
    if(value) {
      this.submit()
    } else {
      let month = this.months[this.mm - 1];
      this.onNgModelChange(month);
    }
  }

  //  customOptions = {
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
  //   series: null
  // };

}
