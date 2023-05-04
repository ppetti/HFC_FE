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

@Component({
  selector: 'app-assegnazione-biglietti-bianchi',
  templateUrl: './assegnazione-biglietti-bianchi.component.html',
  styleUrls: ['./assegnazione-biglietti-bianchi.component.scss']
})
export class AssegnazioneBigliettiBianchiComponent implements OnInit {

  listOperatori = [];
  tipologieVendutiFiltrati = [];
  formMacro: FormGroup;
  formFiltriTabella: FormGroup;
  filteredOptions: Observable<string[]>;
  filteredOptionsOperatore: Observable<string[]>;
  filteredOptionsTipologiaFiltri: Observable<string[]>;
  wrapper: any;
  listaBiglietti = [];

  displayedColumns: string[] = ['numeroDiSerie'];
  listaUtenti: any;
  dataSource: MatTableDataSource<String>;

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
      this.amministratoreService.getAllValidatori(),
      this.amministratoreService.getBigliettiBianchiDisponibili()
    ]).subscribe(
      ([operatori, bigliettiDisponibili]) => {
        this.listOperatori = operatori;
        this.createForm();
        this.sistemaAutoCompleteoperatore();

        this.listaBiglietti = bigliettiDisponibili;
        this.dataSource = new MatTableDataSource(bigliettiDisponibili)
        this.filterSettings();
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;

        this.loader.hide();

      }
    );
    this.createForm();

  }

  compareById(a, b): boolean {
    return a && b && a.id === b.id;
  }

  createForm() {
    this.formMacro = this.fb.group({
      operatore: [, [this.autocompleteObjectValidator(), Validators.required]],
      numeroPartenzaSerie: [, [
        Validators.required,
      ]],
      numeroFinaleSerie: [, [
        Validators.required,
      ]],

    })

  }

  submit() {
    this.loader.show();
    let wrapper = {
      validatore: this.formMacro.value.operatore,
      numeroPartenzaSerie: this.formMacro.value.numeroPartenzaSerie,
      numeroFinaleSerie: this.formMacro.value.numeroFinaleSerie,
    }

    this.amministratoreService.assegnaBigliettiBianchi(wrapper).subscribe(
      res => {
        this.amministratoreService.getBigliettiBianchiDisponibili().subscribe( datiAggiornati => {
          this.listaBiglietti = datiAggiornati;
          this.dataSource = new MatTableDataSource(datiAggiornati)
          this.filterSettings();
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
        })
        this.loader.hide();
      },
      err => {
        this.loader.hide();
        this.openSnackBar(err.error.message, 'chiudi');
      });

  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  sistemaAutoCompleteoperatore() {
    this.filteredOptionsOperatore = this.formMacro.controls.operatore.valueChanges.pipe(
      startWith(''),
      map(value => this.filteroperatore(value)),
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

  public displayFn(tipologia): string {
    return tipologia && tipologia.titolo ? tipologia.titolo : '';
  }

  public displayFnTabella(tipologia): string {
    return tipologia && tipologia.titolo ? tipologia.titolo : '';
  }

  public displayFnOperatore(operatore): string {
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
        return data != null ? data.toString().indexOf(filter) != -1 : false;
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
