import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatPaginator } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '@Src/app/loader/loader.service';
import { ModalService } from '@Src/app/shared/services/modal.service';
import { AmministratoreApiService } from '../../services/amministratore-api.service';

export interface Macrosettore {
  id: string;
  nome: string;
  clienti: any;
}

@Component({
  selector: 'app-gestione-macrosettori',
  templateUrl: './gestione-macrosettori.component.html',
  styleUrls: ['./gestione-macrosettori.component.scss']
})
export class GestioneMacrosettoriComponent implements AfterViewInit {

  //displayedColumns: string[] = ['nome', 'clienti','delete'];
  displayedColumns: string[] = ['nome','delete'];
  listaMacrosettori: any;
  dataSource: MatTableDataSource<Macrosettore>;
  nome = new FormControl('');

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private modalService: ModalService,
    private _snackBar: MatSnackBar,
    private loader: LoaderService,
  ) { }

  ngAfterViewInit() {
    this.getMacrosettori();
  }

  getMacrosettori() {
    this.loader.show();
    this.amministratoreService.getAllMacrosettori().subscribe(
      listaMacrosettori => {
        this.listaMacrosettori = listaMacrosettori
        this.dataSource = new MatTableDataSource(this.listaMacrosettori)
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
        this.filterSettings();
    });
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }


  filterSettings() {
    this.dataSource.filterPredicate = (data, filter) => {
      return this.displayedColumns.some(ele => {
        switch(ele) {
          case 'clienti': {
            let trovato = false;
            data[ele].forEach(cliente => {
              if(cliente.nome != null && cliente.nome.toLowerCase().indexOf(filter) != -1) {
                trovato = true;
              }
            });
            return trovato;
          }
          case 'delete': return null;
          default:  return data[ele] != null ?  data[ele].toLowerCase().indexOf(filter) != -1 : false;
        }
      });
    }
    this.loader.hide();
  }

  deleteMacrocategoria(macro){
    let message = 'Confermando la macrocategoria ' + macro.nome.toUpperCase() + ' verrà eliminata definitivamente dal sistema.'
    let title = 'Vuoi eliminare la macrocategoria?'
    this.modalService.openModal(title, message)
    .afterClosed().subscribe(res =>{
      this.loader.show();
      if(res){
        this.amministratoreService.removeMacrosettore(macro.id).subscribe(
              res => {
                this.openSnackBar(res.messaggio, 'chiudi');
                this.getMacrosettori();
              },
              err => {console.log('err', err)
              this.openSnackBar("Questo tipo di macrocategoria non e' eliminabile", 'chiudi');
            }
            )
      }
      this.loader.hide();
    });
  }

  addMacrocategoria() {
    let macrocategoriaToInsert = {clienti: [], nome: this.nome.value}
    this.amministratoreService.addMacrocategoria(macrocategoriaToInsert).subscribe(
      mess => {
        this.openSnackBar(mess.messaggio, 'chiudi');
        this.nome.reset();
        this.getMacrosettori();
      },
      err => console.log('err', err)
    )
  }

}
