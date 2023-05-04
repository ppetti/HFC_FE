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

export interface BigliettiVenduti {
  titolo: string;
  totInteri: string;
  totRidotti: string;
  tot: any;
}


function compare(a: string, b: string, isAsc: boolean) {
  a = a.toUpperCase();
  b = b.toUpperCase();
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-dettaglio-biglietti-vendita-dialog',
  templateUrl: './dettaglio-biglietti-vendita-dialog.component.html',
  styleUrls: ['./dettaglio-biglietti-vendita-dialog.component.scss']
})
export class DettaglioBigliettiVenditaDialogComponent implements OnInit {
  bigliettiPerTipo;
  tipologieVendutiFiltrati = [];

  orarioList = [ 0,1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23]

  totaleInteriFooter = null;
  totaleRidottiFooter = null;
  totaleFooter = null;

  dataDa;
  dataA;
  formMacro: FormGroup;

  displayedColumns: string[] = ['titolo', 'biglietti interi','biglietti ridotti','totale'];
  dataSource: MatTableDataSource<BigliettiVenduti>;

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
    this.loader.show();
    this.amministratoreService.getAllTipologieBigliettoDimensionale().subscribe(
      tipologieList => {
        this.bigliettiPerTipo = tipologieList;
        this.createForm();
        this.loader.hide();
      }
    )


    this.createForm();

  }

  createForm() {
    this.formMacro = this.fb.group({
      dataDa : [ , [
        Validators.required,
      ]],
      dataA : [, [
        Validators.required,
      ]],
      oraInizio : [0, [
        Validators.required,
      ]],
      oraFine : [23, [
        Validators.required,
      ]],
      tipologiaList : [this.bigliettiPerTipo]
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  aggiustaOreList(){

    if(this.formMacro.value.oraInizio == 23 ){

      this.formMacro.patchValue({oraInizio : 22})
      this.openSnackBar('Orario impostato non valido, è avvenuta una correzione automatica', 'chiudi');

    }
    if(this.formMacro.value.oraFine == 0){
      this.formMacro.patchValue({oraFine : 1})
      this.openSnackBar('Orario impostato non valido, è avvenuta una correzione automatica', 'chiudi');
    }

    if(this.formMacro.value.oraFine <= this.formMacro.value.oraInizio ){
      this.formMacro.patchValue({oraInizio : this.formMacro.value.oraFine - 1});
      this.openSnackBar('Orario impostato non valido, è avvenuta una correzione automatica', 'chiudi');

    }
  }

  addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }

  submit(){
    this.loader.show();
    let wrapper = {
      dataDa : this.addHoursToDate(this.formMacro.value.dataDa,2),
      dataA : this.addHoursToDate(this.formMacro.value.dataA,2),
      oraDa : this.formMacro.value.oraInizio,
      oraA : this.formMacro.value.oraFine,
      tipologiaBigliettoList : this.formMacro.value.tipologiaList
    }

    this.amministratoreService.getBigliettiVendutiPerTipologiaFiltrati(wrapper).subscribe(
      responseTipologie => {

        let listaProvvisoria = responseTipologie;
        let listaAccorpata = [];
        let aggiunto;
        listaProvvisoria.forEach(tipo => {
          aggiunto = false;
          listaAccorpata.forEach(el => {

            if(tipo.tipologiaBiglietto.titolo == el.titolo){

              if(tipo.tipologiaBiglietto.voucher){
                el.totInteri = el.totInteri + (tipo.tipologiaBiglietto.prezzoNettoInteroVoucher * tipo.nBigliettiInteri) ;
                el.totRidotti = el.totRidotti + (tipo.tipologiaBiglietto.prezzoNettoRidottoVoucher * tipo.nBigliettiRidotti);
                el.tot = el.totRidotti + el.totInteri;
              } else {
                el.totInteri = el.totInteri + tipo.totInteri;
                el.totRidotti = el.totRidotti + tipo.totRidotti;
                el.tot = el.totRidotti + el.totInteri;
              }
              aggiunto = true;

            }
          });

          if(!aggiunto){
            let oggetto;


            if(tipo.tipologiaBiglietto.voucher){

              oggetto = {
                titolo: tipo.tipologiaBiglietto.titolo,
                totInteri: (tipo.tipologiaBiglietto.prezzoNettoInteroVoucher * tipo.nBigliettiInteri),
                totRidotti: (tipo.tipologiaBiglietto.prezzoNettoRidottoVoucher * tipo.nBigliettiRidotti),
                tot: (tipo.tipologiaBiglietto.prezzoNettoInteroVoucher * tipo.nBigliettiInteri) + (tipo.tipologiaBiglietto.prezzoNettoRidottoVoucher * tipo.nBigliettiRidotti),
              }
            } else {

              oggetto = {
                titolo: tipo.tipologiaBiglietto.titolo,
                totInteri: tipo.totInteri,
                totRidotti: tipo.totRidotti,
                tot: tipo.totInteri + tipo.totRidotti,
              }
            }
            // listaAccorpata.push(tipo)
            listaAccorpata.push(oggetto)
          }


        });

        this.totaleInteriFooter = 0;
        this.totaleRidottiFooter = 0;
        this.totaleFooter = 0;

        listaAccorpata.forEach(el => {
          this.totaleInteriFooter += el.totInteri;
          this.totaleRidottiFooter += el.totRidotti;
          this.totaleFooter += el.tot;
        });

        this.tipologieVendutiFiltrati = listaAccorpata;
        this.dataSource = new MatTableDataSource(this.tipologieVendutiFiltrati)
        this.changeDetector.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loader.hide();
      },
      err => {
        this.loader.hide();
      })

    }

  compareById( a, b ) : boolean {
    return a && b && a.id === b.id;
  }

  downloadExcel(){
    this.loader.show();

    let tipologieVendutiFiltratiCopy = [...this.tipologieVendutiFiltrati];
    tipologieVendutiFiltratiCopy.push( {titolo: "TOTALI", totInteri: this.totaleInteriFooter, totRidotti: this.totaleRidottiFooter, tot: this.totaleFooter})

    this.amministratoreService.generateExcelBigliettiValoreVenduti(tipologieVendutiFiltratiCopy).subscribe(
      res => {
        let dataA = this.datePipe.transform(this.addHoursToDate(this.formMacro.value.dataA, 2));
        let dataDa = this.datePipe.transform(this.addHoursToDate(this.formMacro.value.dataDa, 2));
        let fileName = ("Dettaglio_Valore_Biglietti_Periodo_" + dataDa + "_A_" + dataA).replace(/ /g,"_");
        const blob = new Blob([this.util.base64ToArrayBuffer(res.excel)], { type : 'application/octet-stream' });
        const file = new File([blob], fileName + '.xlsx', { type: 'application/octet-stream' });
        saveAs(file);
        this.loader.hide();
      })


  }

}
