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

export interface OggettoTabella {
  validatore: any;
  numeroDisponibili: number;
  numeroTotali: number;
}

function compare(a: string, b: string, isAsc: boolean) {
  a = a.toUpperCase();
  b = b.toUpperCase();
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
@Component({
  selector: 'app-registrazione-biglietti-bianchi-venduti',
  templateUrl: './registrazione-biglietti-bianchi-venduti.component.html',
  styleUrls: ['./registrazione-biglietti-bianchi-venduti.component.scss']
})
export class RegistrazioneBigliettiBianchiVendutiComponent implements OnInit {

  listOperatori = [];
  tipologieVendutiFiltrati = [];
  bigliettiPerTipo;
  formMacro: FormGroup;
  // filteredOptions: Observable<string[]>;
  filteredOptionsOperatore: Observable<string[]>;
  filteredOptionsTipologia: Observable<string[]>;
  wrapper: any;
  listaBiglietti = [];

  listaUtenti: any;
  displayedColumns: string[] = ['validatore', 'numeroTotali', 'numeroDisponibili'];
  listaOggettiTabella: any;
  dataSource: MatTableDataSource<OggettoTabella>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
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
      this.amministratoreService.getAllValidatori(),
      this.amministratoreService.getBigliettiBianchiDisponibili(),
      this.amministratoreService.getAllTipologieBiglietto()
    ]).subscribe(
      ([operatori, bigliettiDisponibili, tipologieList]) => {
        this.bigliettiPerTipo = tipologieList;
        this.listOperatori = operatori;
        this.createForm();
        this.sistemaAutoCompleteoperatore();
        this.sistemaAutoCompleteTipologie();

        this.listaBiglietti = bigliettiDisponibili;

        this.loader.hide();

      }
    );
    this.createForm();
    // this.createFormTabella();

  }

  compareById(a, b): boolean {
    return a && b && a.id === b.id;
  }

  createForm() {
    this.formMacro = this.fb.group({
      validatore: [, [this.autocompleteObjectValidator(), Validators.required]],
      tipologia: [, [this.autocompleteObjectValidator(), Validators.required]],
      eta: [, [
        Validators.required,
      ]],
      numeroBiglietti: [, [
        Validators.required,
      ]],
      data: [, [
        Validators.required,
      ]],
      // numeroPartenzaSerie: [, [
      //   Validators.required,
      // ]],
      // numeroFinaleSerie: [, [
      //   Validators.required,
      // ]],

    })

  }

  submit() {
    this.loader.show();
    let wrapper = {
      validatore: this.formMacro.value.validatore,
      numeroBiglietti: this.formMacro.value.numeroBiglietti,
      tipologia: this.formMacro.value.tipologia,
      eta: this.formMacro.value.eta,
      data: this.formMacro.value.data,
      // numeroPartenzaSerie: this.formMacro.value.numeroPartenzaSerie,
      // numeroFinaleSerie: this.formMacro.value.numeroFinaleSerie,
    }

    this.amministratoreService.registraBigliettiBianchi(wrapper).subscribe(
      res => {

        this.getDatiTabella();
        this.loader.hide();
        this.openSnackBar(res.messaggio, 'chiudi');
      },
      err => {
        this.loader.hide();
        this.openSnackBar(err.messaggio, 'chiudi');
      });

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  sistemaAutoCompleteoperatore() {
    this.filteredOptionsOperatore = this.formMacro.controls.validatore.valueChanges.pipe(
      startWith(''),
      map(value => this.filteroperatore(value)),
    );
  }

  sistemaAutoCompleteTipologie() {
    this.filteredOptionsTipologia = this.formMacro.controls.tipologia.valueChanges.pipe(
      startWith(''),
      map(value => this.filterTipologie(value)),
    );
  }

  filteroperatore(value: string): string[] {

    let filterValue = null;
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value;
    }

    return this.listOperatori.filter(option => option.utente.nome.toLowerCase().includes(filterValue));
  }

  filterTipologie(value: string): string[] {
    console.log(this.formMacro.controls.tipologia.value)
    let filterValue = null;
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value;
    }

    return this.bigliettiPerTipo.filter(option => option.titolo.toLowerCase().includes(filterValue));
  }

  public displayFn(tipologia): string {
    return tipologia && tipologia.titolo ? tipologia.titolo : '';
  }

  public displayFnOperatore(validatore): string {
    return validatore && validatore.utente.nome ? validatore.utente.nome : '';
  }

  autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocompleteObject': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }

  ngAfterViewInit() {
    this.getDatiTabella();
  }

  getDatiTabella() {
    this.loader.show();

    this.amministratoreService.getBigliettiBianchiValidatori().subscribe( res =>{
      this.listaOggettiTabella = res;
      this.dataSource = new MatTableDataSource(this.listaOggettiTabella)
      this.dataSource.paginator = this.paginator;
      this.dataSource.sort = this.sort;
      this.sortData();
      this.filterSettings();
      this.loader.hide();
    });
  }

  filterSettings() {
    this.dataSource.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        switch(ele) {
          case 'validatore': return data[ele] != null && data[ele].utente.nome != null ? data[ele].utente.nome.toLowerCase().indexOf(filter) != -1 : false;
          case 'numeroTotali': return data[ele] != null ? data[ele].toString().indexOf(filter) != -1 : false;
          case 'numeroDisponibili':  return data[ele] != null ?  data[ele].toString().toLowerCase().indexOf(filter) != -1 : false;
          }
      });
    }
  }

  sortData() {
    this.dataSource.sortData = (data, sort) => {
      return data.sort((a, b)  => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'validatore': return compare(a.validatore, b.validatore, isAsc);
          default: return 0;
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

  openSnackBar2(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
