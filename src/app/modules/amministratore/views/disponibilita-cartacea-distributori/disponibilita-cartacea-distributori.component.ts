import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '@Src/app/loader/loader.service';
import { ModalService } from '@Src/app/shared/services/modal.service';
import { AmministratoreApiService } from '../../services/amministratore-api.service';
import { ChiusuraService } from '../../services/chiusura.service';
import { UtenteService } from '../../services/utente.service';

export interface OggettoTabella {
  distributore: any;
  numeroDisponibili: number;
  numeroTotali: number;
  tipologiaBiglietto: any;
  eta: string;
}

function compare(a: string, b: string, isAsc: boolean) {
  a = a.toUpperCase();
  b = b.toUpperCase();
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}

@Component({
  selector: 'app-disponibilita-cartacea-distributori',
  templateUrl: './disponibilita-cartacea-distributori.component.html',
  styleUrls: ['./disponibilita-cartacea-distributori.component.scss']
})
export class DisponibilitaCartaceaDistributoriComponent {

  displayedColumns: string[] = ['distributore','tipologiaBiglietto', 'numeroTotali','numeroDisponibili', 'eta'];
  listaOggettiTabella: any;
  dataSource: MatTableDataSource<OggettoTabella>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private _snackBar: MatSnackBar,
    private loader: LoaderService,
  ) { }

  ngAfterViewInit() {
    this.getDatiTabella();
  }

  getDatiTabella() {
    this.loader.show();

    this.amministratoreService.getBigliettiCartaceiDistributori().subscribe( res =>{
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
          case 'distributore': return data[ele] != null && data[ele].utente.nome != null ? data[ele].utente.nome.toLowerCase().indexOf(filter) != -1 : false;
          case 'tipologiaBiglietto': return data[ele] != null && data[ele].titolo != null ?  data[ele].titolo.toLowerCase().indexOf(filter) != -1 : false;
          case 'numeroTotali': return data[ele] != null ? data[ele].toString().indexOf(filter) != -1 : false;
          case 'numeroDisponibili': return data[ele] != null ?  data[ele].toString().toLowerCase().indexOf(filter) != -1 : false;
          case 'eta': return data[ele] != null ?  data[ele].toLowerCase().indexOf(filter) != -1 : false;
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

  sortData() {
    this.dataSource.sortData = (data, sort) => {
      return data.sort((a, b)  => {
        const isAsc = sort.direction === 'asc';
        switch (sort.active) {
          case 'distributore': return compare(a.distributore, b.distributore, isAsc);
          case 'tipologiaBiglietto': return compare(a.tipologiaBiglietto, b.tipologiaBiglietto, isAsc);
          default: return 0;
        }
      });
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }
}

