import { DatePipe } from '@angular/common';
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

export interface Generazione {
  id: string;
  serialeInizio: number;
  serialeFine: number;
  numeroBigliettiGenerati: number
  data: string;
  tipologiaBiglietto: any;
  adult: any;
}

@Component({
  selector: 'app-creazione-biglietti-cartacei',
  templateUrl: './creazione-biglietti-cartacei.component.html',
  styleUrls: ['./creazione-biglietti-cartacei.component.scss']
})
export class CreazioneBigliettiCartaceiComponent implements OnInit {
  bigliettiPerTipo;
  listaOta;
  tipologieVendutiFiltrati = [];
  formMacro: FormGroup;
  filteredOptions: Observable<any[]>;
  listaOtaFiltred: Observable<any[]>;
  wrapper: any;

  displayedColumns: string[] = ['serialeInizio', 'serialeFine', 'data', 'tipologiaBiglietto', 'adult', 'azioni'];
  listaUtenti: any;
  dataSource: MatTableDataSource<Generazione>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
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
    forkJoin([
      this.amministratoreService.getAllTipologieBiglietto(),
      this.amministratoreService.getAllgeneraBigliettiCartacei(),
      this.amministratoreService.getAllDistributoriOta(),
    ]).subscribe(
      ([tipologieList, generazioni, ota]) => {
        this.bigliettiPerTipo = tipologieList;
		this.listaOta = ota;
        this.createForm();
        this.sistemaAutoComplete();
        generazioni.forEach(el=> {
          el.data = this.datePipe.transform(el.data, "dd/MM/yyyy HH:mm:ss")
          el.adult = el.adult ? "Adult" : "Child";
        });
        this.dataSource = new MatTableDataSource(generazioni)
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
      tipologia: [, [this.autocompleteObjectValidator(), Validators.required]],
      eta: [, [
        Validators.required,
      ]],
      numeroBiglietti: [, [
        Validators.required,
      ]],
      numeroPartenzaSerie: [, [
        Validators.required,
      ]],
	  nomeDistributoreOta: [, [this.autocompleteObjectValidator()]],
	  distributoreOta: [false, []],
    prezzoValidazione: []
    })

  }

  submit() {
    this.loader.show();
    let wrapper = {
      tipologia: this.formMacro.value.tipologia,
      eta: this.formMacro.value.eta,
      numeroBiglietti: this.formMacro.value.numeroBiglietti,
      numeroPartenzaSerie: this.formMacro.value.numeroPartenzaSerie,
	  distributoreOta : this.formMacro.value.distributoreOta?this.formMacro.value.nomeDistributoreOta:null,
    prezzoValidazione : this.formMacro.value.distributoreOta?this.formMacro.value.prezzoValidazione:null
    }

    this.amministratoreService.generaBigliettiCartacei(wrapper).pipe(
      switchMap(res => {
        if (res) {
          return this.amministratoreService.generaExcelBigliettiCartacei(wrapper);
        }
      }
      ),
      tap(res => {
          let fileName = ("Biglietti generati").replace(/ /g, "_");
          const blob = new Blob([this.util.base64ToArrayBuffer(res.excel)], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
          const file = new File([blob], fileName + '.xlsx');
          saveAs(file);

      }),
      switchMap(res => {
        if (res) {
          return this.amministratoreService.generaZplCartacei(wrapper);
        }
      }
      ),
      tap(res => {

     }),
    switchMap(() => this.amministratoreService.getAllgeneraBigliettiCartacei()),
      catchError((error,c) => {
        this.loader.hide();
        this.openSnackBar(error.error.message, 'chiudi');
        return of();
      })

    ).subscribe(
      generazioni => {
        generazioni.forEach(el => {
          el.data = this.datePipe.transform(el.data, "dd/MM/yyyy HH:mm:ss")
          el.adult = el.adult ? "Adult" : "Child";
        });

        this.dataSource = new MatTableDataSource(generazioni)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loader.hide();

      });

  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  checkValoreOta(){
	console.log(this.formMacro.controls.distributoreOta.value);
	if (!this.formMacro.controls.distributoreOta.value){
		this.formMacro.controls.nomeDistributoreOta.setValue("");
	}
  }

  downloadExcel(row) {

    this.loader.show();
    let wrapper = {
      tipologia: row.tipologiaBiglietto,
      eta: row.adult == "Adult" ? true : false,
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
    this.listaOtaFiltred = this.formMacro.controls.nomeDistributoreOta.valueChanges.pipe(
      startWith(''),
      map(value => this.filter_ota(value)),
    );
  }

  filter(value: string): string[] {
    console.log(this.formMacro.controls.tipologia.value)
    let filterValue = null;
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value;
    }

    return this.bigliettiPerTipo.filter(option => option.titolo.toLowerCase().includes(filterValue));
  }

  filter_ota(value: string): string[] {
    let filterValue = null;
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value;
    }

    return this.listaOta.filter(option => option.nome.toLowerCase().includes(filterValue));
  }

  public displayFn(tipologia): string {
    return tipologia && tipologia.titolo ? tipologia.titolo : '';
  }

  public displayOta(ota): string {
    return ota && ota.nome ? ota.nome : '';
  }

  autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocompleteObject': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }

  // 'serialeInizio', 'serialeFine', 'data', 'tipologiaBiglietto', 'adult', 'azioni'

  filterSettings() {
    this.dataSource.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        switch(ele) {
          case 'serialeInizio':  return data[ele] != null ? data[ele].toString().indexOf(filter) != -1 : false;
          case 'serialeFine': return data[ele] != null ? data[ele].toString().indexOf(filter) != -1 : false;
          case 'data': return data[ele] != null ?  data[ele].toString().indexOf(filter) != -1 : false;
          case 'tipologiaBiglietto': return data[ele] != null && data[ele].titolo != null ?  data[ele].titolo.toLowerCase().indexOf(filter) != -1 : false;
          case 'adult':  return data[ele] != null ? data[ele].toLowerCase().indexOf(filter) != -1 : false;
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
