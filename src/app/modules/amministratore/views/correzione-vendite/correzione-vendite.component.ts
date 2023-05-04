import { DatePipe } from '@angular/common';
import { Component, ViewChild, OnInit, ChangeDetectorRef } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '@Src/app/loader/loader.service';
import { ModalService } from '@Src/app/shared/services/modal.service';
import { forkJoin, Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { AmministratoreApiService } from '../../services/amministratore-api.service';

export class BigliettoVenduto {
  id: string;
  titolo: string;
  data: string;
  nBigliettiInteri: number;
  nBigliettiRidotti: number;

}


function compare(a: string, b: string, isAsc: boolean) {
  a = a.toUpperCase();
  b = b.toUpperCase();
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-correzione-vendite',
  templateUrl: './correzione-vendite.component.html',
  styleUrls: ['./correzione-vendite.component.scss']
})

export class CorrezioneVenditeComponent implements OnInit {

  displayedColumns: string[] = ['titolo', 'data', 'nBigliettiInteri', 'nBigliettiRidotti', 'azioni'];
  dataSource: MatTableDataSource<BigliettoVenduto>;
  bigliettiPerTipo;
  validatoriList;
  formMacro: FormGroup;
  filteredOptions: Observable<string[]>;
  filteredTipologie: Observable<string[]>;
  listaBiglietti = [];




  // @ViewChild('paginatorTab1', { static: false }) paginator: MatPaginator;

  @ViewChild(MatPaginator, { static: false })
  set paginator(value: MatPaginator) {
    if (this.dataSource) {
      this.dataSource.paginator = value;
    }
  }
  @ViewChild(MatSort) sort: MatSort;

  public validation_msgs = {
    contactAutocompleteControl: [
      { type: 'invalidAutocompleteObject', message: 'Contact name not recognized. Click one of the autocomplete options.' },
      { type: 'required', message: 'Contact is required.' }
    ]
  }

  constructor(
    private amministratoreService: AmministratoreApiService,
    private _snackBar: MatSnackBar,
    private modalService: ModalService,
    private changeDetector: ChangeDetectorRef,
    private loader: LoaderService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
  ) { }

  ngOnInit(): void {
    this.loader.show();

    forkJoin([
      this.amministratoreService.getAllValidatori(),
      this.amministratoreService.getAllTipologieBigliettoDimensionale()
    ]).subscribe(
      ([validatori, tipologieBiglietto]) => {
        console.log("🚀 ~ file: correzione-vendite.component.ts ~ line 76 ~ CorrezioneVenditeComponent ~ ngOnInit ~ tipologieBiglietto", tipologieBiglietto)
        this.validatoriList = validatori;
        this.bigliettiPerTipo = tipologieBiglietto.sort((a, b) => {
          return a.titolo - b.titolo;
        });
        this.createForm();
        this.sistemaAutoComplete();
        this.sistemaAutoCompleteTipologie();
        this.loader.hide();
      }
    );



    this.createForm();


  }

  createForm() {
    this.formMacro = this.fb.group({
      operatore: [, [
        this.autocompleteObjectValidator(), Validators.required,
      ]],
      data: [, [
        Validators.required,
      ]],
      tipologiaList: []
    })
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
        switch (ele) {
          case 'attivo': {
            if (data[ele]) {
              return "abilitato".toLowerCase().indexOf(filter) != -1
            } else {
              return "bloccato".toLowerCase().indexOf(filter) != -1
            }
          }
          case 'ruolo': return data[ele].nome_ruolo.toLowerCase().indexOf(filter) != -1;
          case 'azioni': return false;
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

  // sortData() {
  //   this.dataSource.sortData = (data, sort) => {
  //     return data.sort((a, b)  => {
  //       const isAsc = sort.direction === 'asc';
  //       switch (sort.active) {
  //         case 'nome': return compare(a.nome, b.nome, isAsc);
  //         case 'login': return compare(a.login, b.login, isAsc);
  //         case 'attivo': return compare(a.attivo?"abilitato":"bloccato", b.attivo?"abilitato":"bloccato", isAsc);
  //         case 'ruolo': return compare(a.ruolo.nome_ruolo, b.ruolo.nome_ruolo, isAsc);
  //         case 'telefono': return compare(a.telefono, b.telefono, isAsc);
  //         default: return 0;
  //       }
  //     });
  //   }
  // }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  deleteBigliettoVenduto(biglietto) {
    let message = 'Confermando il biglietto ' + biglietto.titolo.toUpperCase() + ' verrà eliminato definitivamente dal sistema.'
    let title = 'Vuoi eliminare il biglietto?'
    this.modalService.openModal(title, message)
      .afterClosed().subscribe(res => {

        this.amministratoreService.deleteBigliettoVenduto(biglietto.id).subscribe(
          res => {
            this.openSnackBar(res.messaggio, 'chiudi');
            this.submit();
          },
          err => console.log('err', err)
        )
      });
  }


  sistemaAutoComplete() {
    this.filteredOptions = this.formMacro.controls.operatore.valueChanges.pipe(
      startWith(''),
      map(value => this.filterOperatore(value)),
    );

  }

  sistemaAutoCompleteTipologie() {
    this.filteredTipologie = this.formMacro.controls.tipologiaList.valueChanges.pipe(
      startWith(''),
      map(value => this.filterTipologie(value)),
    );
  }

  filterTipologie(value: string): string[] {

    let filterValue = null;
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value;
    }

    return this.bigliettiPerTipo.filter(option => option.titolo.toLowerCase().includes(filterValue));
  }

  filterOperatore(value: string): string[] {
    let filterValue = null;
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
    } else {
      filterValue = value;
    }

    return this.validatoriList.filter(option => option.utente.nome.toLowerCase().includes(filterValue));
  }

  submit() {
    this.loader.show();
    this.amministratoreService.getAllBigliettiVendutiFiltratiOperatore({ validatore: this.formMacro.value.operatore, data: this.addHoursToDate(this.formMacro.value.data, 2), tipologiaBigliettoList: [this.formMacro.value.tipologiaList] }).subscribe(
      responseBigliettiVenduti => {

        this.bigliettiPerTipo


        responseBigliettiVenduti?.forEach(el => {

          this.listaBiglietti.push({
            id: el.id,
            titolo: el.tipologiaBiglietto.titolo,
            data: el.data.split("T")[1].split(".")[0],
            // data: el.data,
            nBigliettiInteri: el.nBigliettiInteri,
            nBigliettiRidotti: el.nBigliettiRidotti
          });

        });

        this.listaBiglietti = this.listaBiglietti.sort((a, b) => {
          return a.data.localeCompare(b.data);
        })
        this.dataSource = new MatTableDataSource(this.listaBiglietti)
        console.log("🚀 ~ file: correzione-vendite.component.ts ~ line 230 ~ CorrezioneVenditeComponent ~ submit ~ this.listaBiglietti", this.listaBiglietti)
        // this.listaOperatori = responseBigliettiVenduti;
        // this.dataSource = new MatTableDataSource(this.listaOperatori)
        // console.log(this.dataSource)
        this.dataSource.paginator = this.paginator;
        this.changeDetector.detectChanges();
        // this.dataSource.sort = this.sort;
        this.loader.hide();
      })
  }

  compareById(a, b): boolean {
    return a && b && a.id === b.id;
  }

  public displayFn(operatore): string {
    return operatore && operatore.utente.nome ? operatore.utente.nome : '';
  }

  public displayTp(tipologiaList): string {
    return tipologiaList && tipologiaList.titolo ? tipologiaList.titolo : '';
  }

  addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }
}
