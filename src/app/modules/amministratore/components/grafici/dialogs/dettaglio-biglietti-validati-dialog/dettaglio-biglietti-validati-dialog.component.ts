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
import { forkJoin } from 'rxjs';

export interface BigliettiVenduti {
  titolo: string;
  totInteri: string;
  totRidotti: string;
  totInteriCartacei: string;
  totRidottiCartacei: string;
  tot: any;
}

function compare(a: string, b: string, isAsc: boolean) {
  a = a.toUpperCase();
  b = b.toUpperCase();
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-dettaglio-biglietti-validati-dialog',
  templateUrl: './dettaglio-biglietti-validati-dialog.component.html',
  styleUrls: ['./dettaglio-biglietti-validati-dialog.component.scss']
})
export class DettaglioBigliettiValidatiDialogComponent implements OnInit {

  bigliettiPerTipo;
  tipologieVendutiFiltrati = [];
  arrayPerDistributore: any[] = [];
  totaleInteriFooter = null;
  totaleRidottiFooter = null;
  totaleFooter = null;
  totaleInteriFooterCartacei = null;
  totaleRidottiFooterCartacei = null;

  orarioList = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23]

  dataDa;
  dataA;
  formMacro: FormGroup;
  arrayTipologie = [];
  displayedColumns: string[] = ['titolo', 'biglietti interi cartacei', 'biglietti ridotti cartacei', 'totale'];

  // displayedColumns: string[] = ['titolo', 'biglietti interi', 'biglietti ridotti', 'biglietti interi cartacei', 'biglietti ridotti cartacei', 'totale'];
  dataSource: MatTableDataSource<BigliettiVenduti>;

  @ViewChild('paginatorTab1', { static: false }) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private loader: LoaderService,
    private datePipe: DatePipe,
    private util: Util,
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
      tipologiaList: [this.bigliettiPerTipo]
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
      tipologiaBigliettoList: this.formMacro.value.tipologiaList
    }

    // 19-03-2023 Questa logica implementa la visualizzazione per tipologia viene commentata per implementare una divisione per distributori assegnati
    /*
    this.amministratoreService.getBigliettiValidatiFiltrati(wrapper).subscribe(
      responseTipologie => {


        let arrayBiglietti = [];
        this.arrayTipologie = [];

        arrayBiglietti = responseTipologie;
        arrayBiglietti.forEach(x => {
          if(x.cartaceo){
            if (this.arrayTipologie.filter(tipo => tipo.titolo === x.tipologiaBiglietto.titolo).length <= 0 ) {
              this.arrayTipologie.push(this.nuovoOggettoTipologia(x.tipologiaBiglietto.titolo));
            }
          }
        })



        arrayBiglietti.forEach(biglietto => {
          this.arrayTipologie.forEach(tipologia => {
            if (biglietto.tipologiaBiglietto.titolo === tipologia.titolo) {
              if (biglietto.bigliettoFull) {
                if (biglietto.cartaceo) {
                  tipologia.totInteriCartacei += 1;
                  tipologia.tot += 1;
                } else {
                  tipologia.totInteri += 1;
                }
              } else {
                if (biglietto.cartaceo) {
                  tipologia.totRidottiCartacei += 1;
                  tipologia.tot += 1;
                } else {
                  tipologia.totRidotti += 1;
                }
              }

            }
          })
        })




        this.totaleInteriFooterCartacei = 0;
        this.totaleRidottiFooterCartacei = 0;
        this.totaleFooter = 0;

        this.arrayTipologie.forEach(el => {

          this.totaleInteriFooterCartacei += el.totInteriCartacei;
          this.totaleRidottiFooterCartacei += el.totRidottiCartacei;
          this.totaleFooter += el.tot;
        });

        this.tipologieVendutiFiltrati = this.arrayTipologie;
        this.dataSource = new MatTableDataSource(this.tipologieVendutiFiltrati)
        this.changeDetector.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loader.hide();

      },
      err => {
        this.loader.hide();
      })
      */

    this.arrayPerDistributore = [];
    forkJoin([
      this.amministratoreService.getBigliettiValidatiFiltrati(wrapper),
      this.amministratoreService.getAllDistributori(),
      this.amministratoreService.getAllDistributoriOta()
    ]).subscribe(
      ([responseTipologie, distributori, ota]) => {

        let arrayBiglietti = [];
        arrayBiglietti = responseTipologie;
        let mappa: Map<any, any[]> = new Map();
        mappa = arrayBiglietti.reduce((acc, oggetto) => {
          let chiave, chiaveOrigine;
          if (oggetto.distributoreOta) {
            chiave = oggetto.distributoreOta;
            chiaveOrigine = "ota";
          } else if (oggetto.idDistributoreAssegnato) {
            chiave = oggetto.idDistributoreAssegnato;
            chiaveOrigine = "dist";
          } else {
            chiave = "NESSUN DISTRIBUTORE ASSOCIATO";
            chiaveOrigine = null;
          }
          if (!acc[chiave]) {
            acc[chiave] = {
              oggetti: [oggetto],
              chiaveOrigine
            };
          } else {
            acc[chiave].oggetti.push(oggetto);
          }
          return acc;
        }, {});


        for (const [key, value] of Object.entries(mappa)) {
          this.arrayPerDistributore.push({
            nome: value.chiaveOrigine == "dist" ? distributori.find(x => x.id === key).titolare : value.chiaveOrigine == "ota" ? ota.find(x => x.id === key).nome : key,
            numero_interi: (value.oggetti as any[]).filter(item => item.bigliettoFull).length,
            numero_ridotti: (value.oggetti as any[]).filter(item => !item.bigliettoFull).length,
            numero_totali: (value.oggetti as any[]).length
          });
        }

        this.totaleInteriFooterCartacei = 0;
        this.totaleRidottiFooterCartacei = 0;
        this.totaleFooter = 0;

        this.arrayPerDistributore.forEach(el => {
          this.totaleInteriFooterCartacei += el.numero_interi;
          this.totaleRidottiFooterCartacei += el.numero_ridotti;
          this.totaleFooter += el.numero_totali;
        });

        this.dataSource = new MatTableDataSource(this.arrayPerDistributore)
        this.changeDetector.detectChanges();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        console.log("🚀 ~ file: dettaglio-biglietti-validati-dialog.component.ts:226 ~ DettaglioBigliettiValidatiDialogComponent ~ mappa ~ mappa:", mappa)
        console.log("🚀 ~ file: dettaglio-biglietti-validati-dialog.component.ts:245 ~ DettaglioBigliettiValidatiDialogComponent ~ submit ~ newMappa:", this.arrayPerDistributore)
        this.loader.hide();

      },
      err => {
        this.loader.hide();
      });

  }

  compareById(a, b): boolean {
    return a && b && a.id === b.id;
  }

  isCartaceo(ticketNumber) {
    let toRet = (ticketNumber <= 50000 || (ticketNumber >= 175052 && ticketNumber <= 190051)) ? true : false;
    return toRet;
  }

  nuovoOggettoTipologia(titolo) {
    return {
      titolo: titolo,
      totInteriCartacei: 0,
      totRidottiCartacei: 0,
      tot: 0
    }
  }

  downloadExcel() {
    this.loader.show();

    this.loader.show();
    let wrapper = {
      dataDa: this.addHoursToDate(this.formMacro.value.dataDa, 2),
      dataA: this.addHoursToDate(this.formMacro.value.dataA, 2),
      oraDa: this.formMacro.value.oraInizio,
      oraA: this.formMacro.value.oraFine
    }


    this.amministratoreService.generateExcelBigliettiNumericiValidati(wrapper).subscribe(
      res => {
        let dataA = this.datePipe.transform(this.addHoursToDate(this.formMacro.value.dataA, 2));
        let dataDa = this.datePipe.transform(this.addHoursToDate(this.formMacro.value.dataDa, 2));
        let fileName = ("Dettaglio_Biglietti_Validati_Periodo_" + dataDa + "_A_" + dataA).replace(/ /g, "_");
        const blob = new Blob([this.util.base64ToArrayBuffer(res.excel)], { type: 'application/octet-stream' });
        const file = new File([blob], fileName + '.xlsx', { type: 'application/octet-stream' });
        saveAs(file);
        this.loader.hide();
      })


  }

}
