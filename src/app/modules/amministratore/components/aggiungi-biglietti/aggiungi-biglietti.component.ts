import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from '../../services/amministratore-api.service';

@Component({
  selector: 'app-aggiungi-biglietti',
  templateUrl: './aggiungi-biglietti.component.html',
  styleUrls: ['./aggiungi-biglietti.component.scss']
})
export class AggiungiBigliettiComponent implements OnInit {

  displayedColumns: string[] = ['tipologia','bigliettiPresenti',  'nFull', 'azioni'];
  dataSource: MatTableDataSource<any>;
  tipologieBiglietto: any;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private _snackBar: MatSnackBar,
    private loader: LoaderService,
  ) { }

  ngOnInit(): void {
    this.getTipologieBiglietto();
  }

  getTipologieBiglietto() {
    this.loader.show();
    this.amministratoreService.getAllTipologieBiglietto().subscribe(
      tipologieBiglietto => {
        this.tipologieBiglietto = tipologieBiglietto;
        this.dataSource = new MatTableDataSource(this.tipologieBiglietto)
        this.dataSource.paginator = this.paginator;
        this.loader.hide();
      }
    )
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  addBiglietti(row) {
    let bigliettiList = [];
    let bigliettoFull = {"tipologiaBiglietto" : {
      "id" : row.id
      },
    "bigliettoFull": true
    }
    // let bigliettoChild = {"tipologiaBiglietto" : {
    //   "id" : row.id
    //   },
    // "bigliettoFull": false
    // }
    let interi = row.qtaInteri ? row.qtaInteri: 0 ;
    for(let i=0; i< interi ; i++) {
      bigliettiList.push(bigliettoFull);
    }
    // let ridotti = row.qtaRidotti ? row.qtaRidotti: 0 ;
    // for(let i=0; i< ridotti ; i++) {
    //   bigliettiList.push(bigliettoChild);
    // }
    this.amministratoreService.addBiglietti(bigliettiList).subscribe(
      res => {
        this.openSnackBar(res.messaggio, 'chiudi');
        this.getTipologieBiglietto();
      }
    )


  }

}
