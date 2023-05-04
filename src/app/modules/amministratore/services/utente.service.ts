import { Injectable } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, ValidationErrors, ValidatorFn, Validators } from "@angular/forms";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoaderService } from "@Src/app/loader/loader.service";
import { AmministratoreApiService } from "./amministratore-api.service";

@Injectable({
    providedIn: 'root'
  })
export class UtenteService {

    formUtente: FormGroup;
    isModifica: boolean = false;
    idUtenteToEdit: string;
    distributore: any;
    isAggiungiCredito: boolean = false;

    constructor(
        private fb: FormBuilder,
        private amministratoreService: AmministratoreApiService,
        private _snackBar: MatSnackBar,
        private loader: LoaderService,
    ) {
    }

    openSnackBar(message: string, action: string) {
      this._snackBar.open(message, action, {
        duration: 3000,
      });
    }

    createForm(){
        this.formUtente = this.fb.group({
          nome:['',  Validators.required],
          login:['', [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]],
          ruolo:['',  Validators.required],
          titolare:[''],
          indirizzo: [''],
          citta: [''],
          telefono:['', [Validators.required, Validators.pattern("^\\s*-?[0-9]{1,10}\\s*$")]],
          abituale:[false],
          creditoTotale:[0],
          creditoDisponibile: [0],
          creditoAggiunto: [0],
        })


      }

      public comparisonValidator() : ValidatorFn{
        return (group: FormGroup): ValidationErrors => {
           const control1 = group.controls['creditoTotale'];
           if (control1.value < this.distributore.creditoTotale && this.isAggiungiCredito) {
             console.log(control1.value, this.distributore.creditoTotale)
            control1.setErrors({minore: true});
           } else {
            control1.setErrors(null);
           }
           return;
     };
  }

    inizializeForm() {
        this.isModifica = false;
        this.formUtente.setValue({
            nome: '',
            login: '',
            ruolo: null,
            titolare: '',
            indirizzo: '',
            citta: '',
            telefono: '',
            abituale: false,
            creditoTotale: 0,
            creditoDisponibile: 0,
            creditoAggiunto: 0,
        });
    }

    populateForm(utente) {
        this.loader.show();
        this.isModifica= true;
        this.idUtenteToEdit = utente.id;
        this.formUtente.get('nome').setValue(utente.nome);
        this.formUtente.get('login').setValue(utente.login);
        this.formUtente.get('ruolo').setValue(utente.ruolo);
        this.formUtente.get('telefono').setValue(utente.telefono);
        if(utente.ruolo.nome_ruolo == 'Rivenditore') {
          this.amministratoreService.getDistributoreById(utente.id).subscribe(
            dis => {
              this.distributore = dis;
              this.formUtente.setValidators(this.comparisonValidator())
              this.formUtente.get('titolare').setValue(this.distributore.titolare);
              this.formUtente.get('citta').setValue(this.distributore.citta);
              this.formUtente.get('indirizzo').setValue(this.distributore.indirizzo);
              this.formUtente.get('abituale').setValue(this.distributore.abituale);
              this.formUtente.get('creditoTotale').setValue(this.distributore.creditoTotale);
              this.formUtente.get('creditoDisponibile').setValue(this.distributore.creditoDisponibile);
              this.loader.hide();
            })
        }
    }

    aggiungiUtente(){
      this.loader.show();
      this.isAggiungiCredito = false;
      let utenteToInsert = {
              nome: this.formUtente.controls.nome.value,
              login: this.formUtente.controls.login.value,
              ruolo: this.formUtente.controls.ruolo.value,
              telefono: this.formUtente.controls.telefono.value
            }
      switch(this.formUtente.controls.ruolo.value.nome_ruolo) {
        case 'Amministratore': {
          let amministratoreToInsert = {'utente': utenteToInsert};
          this.amministratoreService.addAmministratore(amministratoreToInsert).subscribe(
            res => {
              this.loader.hide();
              this.openSnackBar(res.messaggio, 'chiudi')}
              ,
            err => console.log('err', err));
            break;
          }
        case 'Supervisore': {
          let amministratoreToInsert = {'utente': utenteToInsert};
          this.amministratoreService.addSupervisore(amministratoreToInsert).subscribe(
            res => {
              this.loader.hide();
              this.openSnackBar(res.messaggio, 'chiudi')}
              ,
            err => console.log('err', err));
            break;
          }
          case 'Rivenditore': {
            let distributoreToInsert = {
              titolare: this.formUtente.controls.titolare.value,
              citta: this.formUtente.controls.citta.value,
              indirizzo: this.formUtente.controls.indirizzo.value,
              abituale: this.formUtente.controls.abituale.value,
              creditoTotale: this.formUtente.controls.creditoTotale.value >= 0 && this.formUtente.controls.abituale.value ==  true? this.formUtente.controls.creditoTotale.value : 0,
              creditoDisponibile: this.formUtente.controls.creditoTotale.value >= 0 && this.formUtente.controls.abituale.value ==  true? this.formUtente.controls.creditoTotale.value : 0, // IL CREDITO E' UN CAMPO EDITABILE SOLO SE IL CREDITO DISPONIBILE E' UGUALE AL CREDITO QUINDI AVRANNO SEMPRE LO STESSO VALORE INIZIALMENTE
              utente: utenteToInsert
            }
            this.amministratoreService.addDistributore(distributoreToInsert).subscribe(
              res => {
                this.loader.hide();
                this.openSnackBar(res.messaggio, 'chiudi')},
              err => console.log('err', err));
              break;
          }
          case 'Operatore interno': {
            let OperatoreInsert = {
              // titolare: this.formUtente.controls.titolare.value,
              // citta: this.formUtente.controls.citta.value,
              // indirizzo: this.formUtente.controls.indirizzo.value,
              utente: utenteToInsert
            }
            this.amministratoreService.addValidatori(OperatoreInsert).subscribe(
              res => {
                this.loader.hide();
                this.openSnackBar(res.messaggio, 'chiudi')},
              err => console.log('err', err));
              break;
          }
        }
    }

    modificaUtente(){
        this.loader.show();
        let utenteToEdit = {
          nome: this.formUtente.controls.nome.value,
          login: this.formUtente.controls.login.value,
          ruolo: this.formUtente.controls.ruolo.value,
          telefono: this.formUtente.controls.telefono.value};
        if(this.formUtente.controls.ruolo.value.nome_ruolo == 'Rivenditore') {
          let distributoreToEdit = {
            titolare: this.formUtente.controls.titolare.value,
            citta: this.formUtente.controls.citta.value,
            indirizzo: this.formUtente.controls.indirizzo.value,
            abituale: this.formUtente.controls.abituale.value,
            creditoTotale: this.formUtente.controls.creditoTotale.value >= 0 && this.formUtente.controls.abituale.value ==  true? this.formUtente.controls.creditoTotale.value : 0,
            creditoDisponibile: this.formUtente.controls.abituale.value ==  true? this.formUtente.controls.creditoDisponibile.value : 0,
            utente: utenteToEdit
          }
          this.amministratoreService.editDistributore(this.idUtenteToEdit, distributoreToEdit).subscribe(
            res => {
              this.loader.show();
              this.openSnackBar(res.messaggio, 'chiudi');
            },
            err => console.log('err', err)
          )
        } else {
          this.amministratoreService.editUtente(this.idUtenteToEdit, utenteToEdit).subscribe(
            res => {
              this.loader.hide();
              this.openSnackBar(res.messaggio, 'chiudi');
            },
            err => console.log('err', err)
          )
        }


        //this.isAggiungiCredito = false;
    }


}
