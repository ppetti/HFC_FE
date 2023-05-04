import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from '../../services/amministratore-api.service';
import { saveAs } from 'file-saver';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'app-scarica-excel-fermate',
  templateUrl: './scarica-excel-fermate.component.html',
  styleUrls: ['./scarica-excel-fermate.component.scss']
})
export class ScaricaExcelFermateComponent implements OnInit {

  nome: any;
  listaOperatoriFull: any[];
  listaOperatori: any[] = [];
  listaOperatoriCopy: any[];
  listaOperatoriToSend: any[] = [];

  operatoreToModifyList;
  operatoreToModify;
  formMacro;

  @ViewChild('distributoriAdd') distributoriAddSelect: MatSelectionList;

  constructor(
    private apiService: AmministratoreApiService,
    private _snackBar: MatSnackBar,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    private loader: LoaderService
  ) { }

  ngOnInit(): void {
    this.createForm();
    this.getListaDistributori();
  }

  getListaDistributori() {
    this.loader.show();
    this.listaOperatori = [];
    this.apiService.getAllValidatori().subscribe(
      distributori => {
        this.listaOperatoriFull = distributori;
        this.listaOperatoriFull.map(x => {
            this.listaOperatori.push(x);
        })
        this.listaOperatoriCopy = this.listaOperatori;
        this.loader.hide();
      },
      err => {
        this.loader.hide();
      }
    )
  }

  filterItem(value){
    if(!value){
        this.assignCopy();
    } else {
      this.listaOperatori = Object.assign([], this.listaOperatoriCopy).filter(
        item => item.utente.nome.toLowerCase().indexOf(value.toLowerCase()) > -1
     )
    }

  }

  assignCopy(){
    this.listaOperatori = Object.assign([], this.listaOperatoriCopy);
  }

  clearInput() {
    this.nome = '';
    this.filterItem('');
  }

  selectAll() {
    this.distributoriAddSelect.selectAll();
  }

  deselectAll() {
    this.distributoriAddSelect.deselectAll();
  }

  operatoreModificaChanged() {
    this.loader.show();
    this.operatoreToModify = this.operatoreToModifyList[0];
  }

  addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }

  scaricaExcel() {
    this.loader.show()
    this.listaOperatoriToSend = [];
    this.distributoriAddSelect.selectedOptions.selected.forEach( disSelected => {
      this.listaOperatoriToSend.push(
       disSelected.value.utente.id
      )
    });

    let wrapper = {
      dataDa: {data: this.addHoursToDate(this.formMacro.value.dataDa, 2)},
      dataA: {data: this.addHoursToDate(this.formMacro.value.dataA, 2)},
      listaIdOperatori: this.listaOperatoriToSend
    }

    this.apiService.getExcelFermateTotale(wrapper).subscribe( blob => {
      let dataA = this.datePipe.transform(this.addHoursToDate(this.formMacro.value.dataA, 2));
      let dataDa = this.datePipe.transform(this.addHoursToDate(this.formMacro.value.dataDa, 2));
      let fileName = ("Report_Biglietti_Per_Fermata" + dataDa + "_A_" + dataA + ".xlsx").replace(/ /g,"_");
      saveAs(blob, fileName);
      this.loader.hide();
    })
    console.log("🚀 ~ file: scarica-excel-fermate.component.ts ~ line 109 ~ ScaricaExcelFermateComponent ~ scaricaExcel ~ wrapper", wrapper)

  }

  createForm() {
    this.formMacro = this.fb.group({
      dataDa: [, [
        Validators.required,
      ]],
      dataA: [, [
        Validators.required,
      ]]
    })
  }

}
