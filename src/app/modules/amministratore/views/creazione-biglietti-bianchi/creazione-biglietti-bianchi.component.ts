import { DatePipe } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '@Src/app/loader/loader.service';
import { Util } from '@Src/app/shared/util';
import { forkJoin, Observable, of } from 'rxjs';
import { catchError, map, startWith, switchMap, tap } from 'rxjs/operators';
import { AmministratoreApiService } from '../../services/amministratore-api.service';

export interface Generazione {
  id: string;
  serialeInizio: number;
  serialeFine: number;
  numeroBigliettiGenerati: number
  data: string;
  tipologiaBiglietto: any;

}
@Component({
  selector: 'app-creazione-biglietti-bianchi',
  templateUrl: './creazione-biglietti-bianchi.component.html',
  styleUrls: ['./creazione-biglietti-bianchi.component.scss']
})
export class CreazioneBigliettiBianchiComponent implements OnInit {

  bigliettiPerTipo;
  tipologieVendutiFiltrati = [];
  formMacro: FormGroup;
  filteredOptions: Observable<string[]>;
  wrapper: any;

  displayedColumns: string[] = ['serialeInizio', 'serialeFine', 'data', 'azioni'];
  listaUtenti: any;
  dataSource: MatTableDataSource<Generazione>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;



  constructor(private amministratoreService: AmministratoreApiService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private changeDetector: ChangeDetectorRef,
    private loader: LoaderService,
    private datePipe: DatePipe,
    private util: Util,
    ) { }

  ngOnInit(): void {
    this.loader.show();




      this.amministratoreService.getAllgeneraBigliettiBianchi().subscribe(
      generazioni => {
        this.createForm();
        generazioni.forEach(el=> {
          el.data = this.datePipe.transform(el.data, "dd/MM/yyyy HH:mm:ss")
        });
        this.dataSource = new MatTableDataSource(generazioni)
        // this.filterSettings();
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
      numeroBiglietti: [, [
        Validators.required,
      ]],
      numeroPartenzaSerie: [, [
        Validators.required,
      ]],

    })

  }

  submit() {

    this.loader.show();

    let wrapper = {
      numeroBiglietti: this.formMacro.value.numeroBiglietti,
      numeroPartenzaSerie: this.formMacro.value.numeroPartenzaSerie,
      data: null,
    }

    this.amministratoreService.generaBigliettiBianchi(wrapper).pipe(
      switchMap(res => {
        if (res) {
          return this.amministratoreService.generaPdfBigliettiBianchi(wrapper);
        }
      }
      ),
      tap(res => {
        let dataFile = new Date().toLocaleDateString();
        dataFile = dataFile.split('/').join('-');
        const linkSource = `data:application/pdf;base64,${res.pdf}`;
        const downloadLink = document.createElement("a");
        const fileName = "creazione_biglietti_"+ dataFile + ".pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();

      }),
      switchMap(() => this.amministratoreService.getAllgeneraBigliettiBianchi()),
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

    // this.amministratoreService.generaBigliettiBianchi(wrapper).subscribe(ris => {

    //   this.loader.hide();
    //   this.amministratoreService.generaPdfBigliettiBianchi(wrapper).subscribe( res => {
    //     let dataFile = new Date().toLocaleDateString();
    //     dataFile = dataFile.split('/').join('-');
    //     const linkSource = `data:application/pdf;base64,${res.pdf}`;
    //     const downloadLink = document.createElement("a");
    //     const fileName = "creazione_biglietti_"+ dataFile + ".pdf";
    //     downloadLink.href = linkSource;
    //     downloadLink.download = fileName;
    //     downloadLink.click();
    //   })

    // })


  }

  downloadPdf(row) {

    this.loader.show();
    let wrapper = {
      numeroBiglietti: row.numeroBigliettiGenerati,
      numeroPartenzaSerie: row.serialeInizio,
      data: new Date(row.data),
    }


    this.amministratoreService.generaPdfBigliettiBianchi(wrapper).subscribe(
      (res) => {
        let dataFile = new Date().toLocaleDateString();
        dataFile = dataFile.split('/').join('-');
        const linkSource = `data:application/pdf;base64,${res.pdf}`;
        const downloadLink = document.createElement("a");
        const fileName = "creazione_biglietti_"+ dataFile + ".pdf";
        downloadLink.href = linkSource;
        downloadLink.download = fileName;
        downloadLink.click();
        this.loader.hide();
      }
    );


  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  public displayFn(tipologia): string {
  return tipologia && tipologia.titolo ? tipologia.titolo : '';
  }

  autocompleteObjectValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (typeof control.value === 'string') {
        return { 'invalidAutocompleteObject': { value: control.value } }
      }
      return null  /* valid option selected */
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  arrayBufferToBase64( buffer ) {
    var binary = '';
    var bytes = new Uint8Array( buffer );
    var len = bytes.byteLength;
    for (var i = 0; i < len; i++) {
        binary += String.fromCharCode( bytes[ i ] );
    }
    return window.btoa( binary );
  }

}

function saveAs(file: File) {
  throw new Error('Function not implemented.');
}






