import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSelectionList } from '@angular/material/list';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableDataSource } from '@angular/material/table';
import { LoaderService } from '@Src/app/loader/loader.service';
import { DistributoreApiService } from '@Src/app/modules/distributore/services/distributore-api.service';
import { ValidatoreApiService } from '@Src/app/modules/validatore/services/validatore-api.service';
import { forkJoin } from 'rxjs';
import { AmministratoreApiService } from '../../services/amministratore-api.service';

@Component({
  selector: 'app-invio-notifiche',
  templateUrl: './invio-notifiche.component.html',
  styleUrls: ['./invio-notifiche.component.scss']
})
export class InvioNotificheComponent implements OnInit {

  validatoriList: any[];
  distributoriList: any[];
  distCopy;
  valCopy;
  nome: any;
  titolo: string;
  testo: string;
  formEmail: FormGroup;

  @ViewChild('distributori') distributori: MatSelectionList;
  @ViewChild('validatori') validatori: MatSelectionList;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private loader: LoaderService,
    private fb: FormBuilder,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.createForm();
    forkJoin([
      this.amministratoreService.getAllDistributori(),
      this.amministratoreService.getAllValidatori()
    ]).subscribe(
      ([distributori, validatori]) => {
        this.distributoriList = distributori;
        this.distCopy = distributori;
        this.validatoriList = validatori;
        this.valCopy = validatori;
        this.loader.hide();
      }
    )
  }

  selectAll(value) {
    value == 'dist' ? this.distributori.selectAll() : this.validatori.selectAll();
  }

  deselectAll(value) {
    value == 'dist' ? this.distributori.deselectAll() : this.validatori.deselectAll();
  }

  assignCopy(){
    this.distributoriList = Object.assign([], this.distributoriList);
    this.validatoriList = Object.assign([], this.validatoriList);
  }

  filterItem(value){
    if(!value){
        this.assignCopy();
    }
    this.distributoriList = Object.assign([], this.distCopy).filter(
       item => item.utente.nome.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
    this.validatoriList = Object.assign([], this.valCopy).filter(
      item => item.utente.nome.toLowerCase().indexOf(value.toLowerCase()) > -1
   )
  }

  clearInput() {
    this.nome = '';
    this.filterItem('');
  }

  createForm() {
    this.formEmail = this.fb.group({
      titolo: [, [
        Validators.required,
      ]],
      testo: [, [
        Validators.required,
      ]]
    })
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  inviaNotifica(){
      this.loader.show();
      // this.distributoriList[0].utente.login = "gianluca.gargani95@gmail.com"
      // console.log(resDist, resVal)

      let distributoriSel = [];
      this.distributori.selectedOptions.selected.forEach( disSelected => {
        distributoriSel.push(disSelected.value)
      });

      let validatoriSel = [];
      this.validatori.selectedOptions.selected.forEach( valSelected => {
        validatoriSel.push(valSelected.value)
      });

      let wrapperDist = {
        distributoreList : distributoriSel,
        titolo : this.formEmail.value.titolo,
        testo : this.formEmail.value.testo
      }

      let wrapperVal = {
        validatoreList : validatoriSel,
        titolo : this.formEmail.value.titolo,
        testo : this.formEmail.value.testo
      }

      forkJoin([
        this.amministratoreService.inviaNotificaDistributori(wrapperDist),
        this.amministratoreService.inviaNotificaValidatori(wrapperVal),]).subscribe(
          ([resDist, resVal]) => {
          this.loader.hide();
          this.openSnackBar('La notifica è stata inviata correttamente', 'chiudi')
      },
      err => {
        this.openSnackBar('Impossibile inviare la notifica in questo momento, riprovare più tardi', 'chiudi')
      }
      )


  }


}
