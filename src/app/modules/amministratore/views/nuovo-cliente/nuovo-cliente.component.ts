import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from '../../services/amministratore-api.service';
import { ClienteService } from '../../services/cliente.service';
import { GestioneClientiComponent } from '../gestione-clienti/gestione-clienti.component';

@Component({
  selector: 'app-nuovo-cliente',
  templateUrl: './nuovo-cliente.component.html',
  styleUrls: ['./nuovo-cliente.component.scss']
})
export class NuovoClienteComponent implements OnInit {

  macrosettori: any;

  constructor(
    private dialogRef: MatDialogRef<GestioneClientiComponent>,
    private amministratoreService: AmministratoreApiService,
    public clienteService: ClienteService,
    private loader: LoaderService,
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.amministratoreService.getAllMacrosettori().subscribe(
      macrosettori => {
      this.macrosettori = macrosettori
      this.loader.hide();
      }
    )
  }

  submit(){
    if(this.clienteService.isModifica){
      this.clienteService.modificaCliente();
    }else{
      this.clienteService.aggiungiCliente();
    }
    this.close();
  }

  close(){
    this.clienteService.formCliente.reset();
    this.clienteService.inizializeForm();
    this.dialogRef.close();
  }

  compareById( a, b ) : boolean {
    return a && b && a.id === b.id;
  }

}
