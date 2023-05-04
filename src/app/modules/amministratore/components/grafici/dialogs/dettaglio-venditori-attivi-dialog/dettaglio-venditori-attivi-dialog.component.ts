import { DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from '@Src/app/modules/amministratore/services/amministratore-api.service';

export interface Venditori {
  id: string;
  idDistributore: string;
  login: string;
  nome: string;
  telefono: string;
}

@Component({
  selector: 'app-dettaglio-venditori-attivi-dialog',
  templateUrl: './dettaglio-venditori-attivi-dialog.component.html',
  styleUrls: ['./dettaglio-venditori-attivi-dialog.component.scss']
})
export class DettaglioVenditoriAttiviDialogComponent implements OnInit {

  bigliettiPerTipo;

  isChecked: boolean = true;

  formMacro: FormGroup;

  listaDistributori = [];

  displayedColumns: string[] = ['nome', 'login','telefono'];
  dataSource: MatTableDataSource<Venditori>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    private loader: LoaderService,
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
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }


  addHoursToDate(date: Date, hours: number): Date {
    return new Date(new Date(date).setHours(date.getHours() + hours));
  }

  submit(){
      this.loader.show();
      this.amministratoreService.getVenditoriAttivi(this.datePipe.transform(this.addHoursToDate(this.formMacro.value.dataDa,2),"dd/MM/yyyy"), this.datePipe.transform(this.addHoursToDate(this.formMacro.value.dataA,2),"dd/MM/yyyy"),this.isChecked ).subscribe(
      responseTipologie => {
        this.listaDistributori = responseTipologie;
        this.dataSource = new MatTableDataSource(this.listaDistributori)
        console.log(this.dataSource)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.loader.hide();
      })

    }

}
