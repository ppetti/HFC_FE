import { Component, Injectable, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from '../../services/amministratore-api.service';
import { UtenteService } from '../../services/utente.service';

@Component({
  selector: 'app-nuovo-utente',
  templateUrl: './nuovo-utente.component.html',
  styleUrls: ['./nuovo-utente.component.scss']
})
export class NuovoUtenteComponent implements OnInit {

  hide = true;
  ruoli;
  //abituale = false;

  constructor(
    private dialogRef: MatDialogRef<NuovoUtenteComponent>,
    private amministratoreService: AmministratoreApiService,
    public utenteService: UtenteService,
    private loader: LoaderService,
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.amministratoreService.getAllRuoli().subscribe(
      listaRuoli => {
        this.ruoli = listaRuoli;
        this.loader.hide();
      }
    )

      this.utenteService.formUtente.valueChanges
      .subscribe(value=> {



        if (this.utenteService.formUtente.dirty && this.utenteService.formUtente.controls.creditoTotale.value != null && this.utenteService.formUtente.controls.creditoAggiunto.value != null) {

          if (this.utenteService.isAggiungiCredito) {

            this.utenteService.formUtente.patchValue({ creditoDisponibile: parseFloat((parseFloat(this.utenteService.distributore.creditoDisponibile) + parseFloat(this.utenteService.formUtente.controls.creditoAggiunto.value)).toFixed(2)) }, {emitEvent: false});
            this.utenteService.formUtente.patchValue({ creditoTotale: parseFloat((parseFloat(this.utenteService.distributore.creditoTotale) + parseFloat(this.utenteService.formUtente.controls.creditoAggiunto.value)).toFixed(2))}, {emitEvent: false});
            }

            if (this.utenteService.isModifica && !this.utenteService.isAggiungiCredito) {

                this.utenteService.formUtente.patchValue({ creditoDisponibile: parseFloat((parseFloat(this.utenteService.distributore.creditoDisponibile) + parseFloat(this.utenteService.formUtente.controls.creditoTotale.value) - parseFloat(this.utenteService.distributore.creditoTotale)).toFixed(2)) }, {emitEvent: false});
            }

            if (!this.utenteService.isModifica && !this.utenteService.isAggiungiCredito) {

                this.utenteService.formUtente.patchValue({ creditoDisponibile: parseFloat((parseFloat(this.utenteService.distributore.creditoDisponibile) + parseFloat(this.utenteService.formUtente.controls.creditoTotale.value) - parseFloat(this.utenteService.distributore.creditoTotale)).toFixed(2)) }, {emitEvent: false});

            }


        }
        if(this.utenteService.formUtente.dirty && this.utenteService.formUtente.controls.creditoTotale.value == null || this.utenteService.formUtente.controls.creditoAggiunto.value == null){
        //QUESTO CASO SERVE QUANDO L'UTENTE CANCELLA IL CREDITO TOTALE O DA AGGIUNGERE, IL COMPORTAMENTO DI CREDITO DISPONIBILE E TOTALE VARIA A SECONDA DEI DUE CASI
          this.utenteService.formUtente.patchValue({ creditoDisponibile: this.utenteService.isAggiungiCredito ? this.utenteService.distributore.creditoDisponibile: 0 }, {emitEvent: false});

          if(this.utenteService.isAggiungiCredito){
            this.utenteService.formUtente.patchValue({ creditoTotale: this.utenteService.distributore.creditoTotale}, {emitEvent: false});
          }

        }

        });
  }

  compareById( a, b ) : boolean {
    return a && b && a.id === b.id;
  }

  submit(){
    if(this.utenteService.isModifica){
      this.utenteService.modificaUtente();
    }else{
      this.utenteService.aggiungiUtente();
    }
    this.close();
  }

  close(){
    this.utenteService.formUtente.reset();
    this.utenteService.inizializeForm();
    this.dialogRef.close();
  }

  checkbox(e){
    console.log(this.utenteService.formUtente['controls'].creditoDisponibile.value, this.utenteService.formUtente['controls'].creditoTotale.value)
    e.preventDefault();
    return false;
  }

  // aggiornaCreditoDisponibile(){
  //   this.utenteService.distributore.creditoDisponibile = this.utenteService.formUtente.controls.creditoTotale.value;
  // }
}
