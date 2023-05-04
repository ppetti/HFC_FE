import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from './amministratore-api.service';

@Injectable({
  providedIn: 'root'
})
export class ClienteService {

  formCliente: FormGroup;
  isModifica = false;
  idClienteToEdit: string;

  constructor(
    private fb: FormBuilder,
    private amministratoreService: AmministratoreApiService,
    private _snackBar: MatSnackBar,
    private loader: LoaderService,
  ) { }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  createForm(){
      this.formCliente = this.fb.group({
        nome:['',  Validators.required],
        email:['', Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")],
        telefono:['', Validators.pattern("^\\s*-?[0-9]{1,10}\\s*$")],
        macrosettori:[[]]
      })
    }

  inizializeForm() {
    this.isModifica = false;
    this.formCliente.setValue({
        nome: '',
        email: '',
        telefono: '',
        macrosettori:[]
    });
  }

  aggiungiCliente() {
    this.loader.show();
    let clienteToInsert = {...this.formCliente.value};
    this.amministratoreService.addCliente(clienteToInsert).subscribe(
      res => {
        this.loader.hide();
        this.openSnackBar(res.messaggio, 'chiudi');
      },
      err => console.log('err', err)
    )
  }

  populateForm(fornitore) {
    this.isModifica= true;
    this.idClienteToEdit = fornitore.id;
    this.formCliente.get('nome').setValue(fornitore.nome);
    this.formCliente.get('email').setValue(fornitore.email? fornitore.email: '');
    this.formCliente.get('telefono').setValue(fornitore.telefono? fornitore.telefono: '');
    this.formCliente.get('macrosettori').setValue(fornitore.macrosettori);
  }

  modificaCliente() {
    this.loader.show();
    let clienteToEdit = {...this.formCliente.value};
    this.amministratoreService.updateCliente(this.idClienteToEdit, clienteToEdit).subscribe(
      res => {
        this.loader.hide();
        this.openSnackBar(res.messaggio, 'chiudi');
      },
      err => console.log('err', err)
    )
  }

}
