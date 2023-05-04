import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from '@Src/app/modules/amministratore/services/amministratore-api.service';
import { Util } from '@Src/app/shared/util';
import { saveAs } from 'file-saver';

export interface PasseggeriGiornalieri {
  data: string;
  totalePasseggeriPerGiorno: number;
}

function compare(a: string, b: string, isAsc: boolean) {
  a = a.toUpperCase();
  b = b.toUpperCase();
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-dettaglio-passeggeri',
  templateUrl: './dettaglio-passeggeri.component.html',
  styleUrls: ['./dettaglio-passeggeri.component.scss']
})
export class DettaglioPasseggeriComponent implements OnInit {

  bigliettiPerTipo;
  passeggeriFiltrati = [];
  totaleFooter = null;
  passeggeriFiltratiCopy = [];
  orarioList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

  dataDa;
  dataA;
  formMacro: FormGroup;

  displayedColumns: string[] = ['data', 'passeggeri'];
  dataSource: MatTableDataSource<PasseggeriGiornalieri>;

  @ViewChild('paginatorTab1', {static: false}) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private loader: LoaderService,
    private datePipe: DatePipe,
    private util : Util,
  ) { }

  ngOnInit(): void {

    this.createForm();

  }

  createForm() {
    this.formMacro = this.fb.group({
      dataDa: [, [
        Validators.required,
      ]],
      dataA: [, [
        Validators.required,
      ]],
      oraInizio: [0, [
        Validators.required,
      ]],
      oraFine: [23, [
        Validators.required,
      ]],
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  aggiustaOreList() {

    if (this.formMacro.value.oraInizio == 23) {

      this.formMacro.patchValue({ oraInizio: 22 })
      this.openSnackBar('Orario impostato non valido, è avvenuta una correzione automatica', 'chiudi');

    }
    if (this.formMacro.value.oraFine == 0) {
      this.formMacro.patchValue({ oraFine: 1 })
      this.openSnackBar('Orario impostato non valido, è avvenuta una correzione automatica', 'chiudi');
    }

    if (this.formMacro.value.oraFine <= this.formMacro.value.oraInizio) {
      this.formMacro.patchValue({ oraInizio: this.formMacro.value.oraFine - 1 });
      this.openSnackBar('Orario impostato non valido, è avvenuta una correzione automatica', 'chiudi');

    }
  }

  addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }

  submit() {
    this.loader.show();
    let wrapper = {
      dataDa: this.addHoursToDate(this.formMacro.value.dataDa, 2),
      dataA: this.addHoursToDate(this.formMacro.value.dataA, 2),
      oraDa: this.formMacro.value.oraInizio,
      oraA: this.formMacro.value.oraFine,
      tipologiaBigliettoList: null
    }

    this.amministratoreService.getPasseggeriFiltrati(wrapper).subscribe(
      responsePasseggeri => {

        this.passeggeriFiltrati = responsePasseggeri;
        this.passeggeriFiltratiCopy = [];
        this.totaleFooter = 0;

        this.passeggeriFiltrati.forEach(el => {

          let objClonato = {
            data: new Date(),
            totalePasseggeriPerGiorno: 0
          }

          objClonato.data = this.addHoursToDate(new Date(el.data), 2);
          objClonato.totalePasseggeriPerGiorno = el.totalePasseggeriPerGiorno;

          this.passeggeriFiltratiCopy.push(objClonato);
          let data = new Date(el.data.replace(/-/g, "/"));
          console.log(data, data.getMonth())
          el.data = data.getDate() + "/" + (data.getMonth() + 1) + "/" + data.getFullYear();
          this.totaleFooter = this.totaleFooter + el.totalePasseggeriPerGiorno;
        });

        this.dataSource = new MatTableDataSource(this.passeggeriFiltrati)
        this.changeDetector.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loader.hide();
      })
  }

  compareById(a, b): boolean {
    return a && b && a.id === b.id;
  }

  downloadExcel(){
    this.loader.show();

    this.amministratoreService.generateExcelPasseggeriFiltrati(this.passeggeriFiltratiCopy).subscribe(
      res => {
        let dataA = this.datePipe.transform(this.addHoursToDate(this.formMacro.value.dataA, 2));
        let dataDa = this.datePipe.transform(this.addHoursToDate(this.formMacro.value.dataDa, 2));
        let fileName = ("Dettaglio_passeggeri_filtrati_periodo_" + dataDa + "_A_" + dataA).replace(/ /g,"_");
        const blob = new Blob([this.util.base64ToArrayBuffer(res.excel)], { type : 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const file = new File([blob], fileName + '.xlsx');
        saveAs(file);
        this.loader.hide();
      })


  }

}

