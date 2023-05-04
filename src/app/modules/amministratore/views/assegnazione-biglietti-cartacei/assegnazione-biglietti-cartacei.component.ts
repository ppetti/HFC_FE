import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from '@Src/app/modules/amministratore/services/amministratore-api.service';
import { Util } from '@Src/app/shared/util';
import { saveAs } from 'file-saver';
import { EMPTY, forkJoin, Observable, of } from 'rxjs';
import { map, startWith, switchMap, tap, catchError } from 'rxjs/operators';

export interface Biglietto {
  bigliettoFull: boolean;
  // cartaceo: boolean;
  // dataEmissione: string
  // dataEmissioneToPrint: string
  // dataScadenza: string
  // errorMessage: string
  // generazioneId: string
  // hasError: boolean;
  // id: string
  // idBigliettoWave: string
  // idDistributoreAssegnato: string
  numeroDiSerie: number
  // pdf: any
  // riservato: any
  // ticketNumber: number
  tipologiaBiglietto: any
  // validato: string
  // venduto: boolean;
  // wave: boolean;
  // zpl: any
}

@Component({
  selector: 'app-assegnazione-biglietti-cartacei',
  templateUrl: './assegnazione-biglietti-cartacei.component.html',
  styleUrls: ['./assegnazione-biglietti-cartacei.component.scss']
})
export class AssegnazioneBigliettiCartaceiComponent implements OnInit {

  bigliettiPerTipo;
  bigliettiPerTipoTabella;
  listDistributori = [];
  tipologieVendutiFiltrati = [];
  formMacro: FormGroup;
  formFiltriTabella: FormGroup;
  filteredOptions: Observable<string[]>;
  filteredOptionsDistributore: Observable<string[]>;
  filteredOptionsTipologiaFiltri: Observable<string[]>;
  wrapper: any;
  listaBiglietti = [];

  displayedColumns: string[] = ['tipologiaBiglietto', 'numeroDiSerie', 'bigliettoFull'];
  listaUtenti: any;
  dataSource: MatTableDataSource<Biglietto>;

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }

  @ViewChild(MatSort) sort: MatSort;



  constructor(
    private amministratoreService: AmministratoreApiService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private loader: LoaderService,
    private util: Util,
  ) { }

  ngOnInit(): void {
    this.loader.show();

    forkJoin([
      this.amministratoreService.getAllTipologieBiglietto(),
      this.amministratoreService.getAllDistributori()
    ]).subscribe(
      ([tipologieList, distributori]) => {
        this.bigliettiPerTipo = tipologieList;
        this.bigliettiPerTipoTabella = tipologieList;
        this.listDistributori = distributori;
        this.createForm();
        this.createFormTabella();
        this.sistemaAutoComplete();
        this.sistemaAutoCompleteFiltriTabella();
        this.sistemaAutoCompleteDistributore();
        this.loader.hide();

      }
    );

    this.createForm();
    this.createFormTabella();
  }

  compareById(a, b): boolean {
    return a && b && a.id === b.id;
  }

  createForm() {
    this.formMacro = this.fb.group({
      distributore: [, [this.autocompleteObjectValidator(), Validators.required]],
      tipologia: [, [this.autocompleteObjectValidator(), Validators.required]],
      eta: [, [
        Validators.required,
      ]],
      // numeroBiglietti: [, [
      //   Validators.required,
      // ]],
      numeroPartenzaSerie: [, [
        Validators.required,
      ]],
      numeroFinaleSerie: [, [
        Validators.required,
      ]],

      prezzoValidazione: [, [
      ]],

    })

  }

  createFormTabella() {
    this.formFiltriTabella = this.fb.group({
      tipologia: [, [this.autocompleteObjectValidator(), Validators.required]],
      eta: [, [
        Validators.required,
      ]],

    })

  }

  submit() {
    this.loader.show();
    let wrapper = {
      distributore: this.formMacro.value.distributore,
      tipologia: this.formMacro.value.tipologia,
      eta: this.formMacro.value.eta == "true"? true : false,
      numeroBiglietti: this.formMacro.value.numeroBiglietti,
      numeroPartenzaSerie: this.formMacro.value.numeroPartenzaSerie,
      numeroFinaleSerie: this.formMacro.value.numeroFinaleSerie,
      prezzoValidazione: this.formMacro.value.prezzoValidazione,
    }

    this.amministratoreService.assegnaBigliettiCartacei(wrapper).subscribe(
      res => {
        if(this.formFiltriTabella.valid){
          this.submitTabella();
        }

        this.loader.hide();
      },
      err => {
        this.loader.hide();
        this.openSnackBar(err.error.message, 'chiudi');
      });

  }

  submitTabella(){
    this.loader.show();
    let wrapper = {
      tipologia: this.formFiltriTabella.value.tipologia,
      eta: this.formFiltriTabella.value.eta,
    }

    this.amministratoreService.getBigliettiCartaceiDisponibili(wrapper).subscribe(
      res => {
        this.listaBiglietti = res;
        this.listaBiglietti.forEach(el => {
          el.bigliettoFull = el.bigliettoFull ? "Adult" : "Child";
        });
        this.dataSource = new MatTableDataSource(res)
        this.filterSettings();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loader.hide();
      }
    )
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }


  downloadExcel(row) {

    this.loader.show();
    let wrapper = {
      tipologia: row.tipologia,
      eta: row.eta,
      numeroBiglietti: row.numeroBigliettiGenerati,
      numeroPartenzaSerie: row.serialeInizio,
    }

    console.log(wrapper)


    this.amministratoreService.generaExcelBigliettiCartacei(wrapper).subscribe(
      (res) => {
        let fileName = ("Biglietti generati").replace(/ /g, "_");
        const blob = new Blob([this.util.base64ToArrayBuffer(res.excel)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        const file = new File([blob], fileName + '.xlsx');
        saveAs(file);
        this.loader.hide();

      }
    );


  }

  sistemaAutoComplete() {
    this.filteredOptions = this.formMacro.controls.tipologia.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value)),
    );

  }

  sistemaAutoCompleteFiltriTabella() {
    this.filteredOptionsTipologiaFiltri = this.formFiltriTabella.controls.tipologia.valueChanges.pipe(
      startWith(''),
      map(value => this.filter(value)),
    );

  }

  sistemaAutoCompleteDistributore() {
    this.filteredOptionsDistributore = this.formMacro.controls.distributore.valueChanges.pipe(
      startWith(''),
      map(value => this.filterDistributore(value)),
    );

  }

  filter(value: string): string[] {
    let filterValue = null;
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value;
    }

    return this.bigliettiPerTipo.filter(option => option.titolo.toLowerCase().includes(filterValue));
  }

  filterTabella(value: string): string[] {
    let filterValue = null;
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value;
    }

    return this.bigliettiPerTipoTabella.filter(option => option.titolo.toLowerCase().includes(filterValue));
  }

  filterDistributore(value: string): string[] {

    let filterValue = null;
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value;
    }

    return this.listDistributori.filter(option => option.utente.nome.toLowerCase().includes(filterValue));
  }

  public displayFn(tipologia): string {
    return tipologia && tipologia.titolo ? tipologia.titolo : '';
  }

  public displayFnTabella(tipologia): string {
    return tipologia && tipologia.titolo ? tipologia.titolo : '';
  }

  public displayFnDistributore(operatore): string {
    return operatore && operatore.utente.nome ? operatore.utente.nome : '';
  }

  autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocompleteObject': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }

  filterSettings() {
    this.dataSource.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        switch(ele) {
          case 'tipologiaBiglietto': return data[ele] != null && data[ele].titolo != null ?  data[ele].titolo.toLowerCase().indexOf(filter) != -1 : false;
          case 'numeroDiSerie': return data[ele] != null ? data[ele].toString().indexOf(filter) != -1 : false;
          default: return data[ele].toLowerCase().indexOf(filter) != -1;
        }
      });
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

}
