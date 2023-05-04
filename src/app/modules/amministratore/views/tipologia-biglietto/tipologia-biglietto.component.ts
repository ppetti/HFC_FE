import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { AmministartoreNavigationService } from '../../services/amministratore-navigation.service';
import { AmministratoreApiService } from '../../services/amministratore-api.service';
import { TipologiaBigliettoService } from '../../services/tipologia-biglietto.service';
import { LoaderService } from '@Src/app/loader/loader.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-tipologia-biglietto',
  templateUrl: './tipologia-biglietto.component.html',
  styleUrls: ['./tipologia-biglietto.component.scss']
})
export class TipologiaBigliettoComponent implements OnInit {

  formTipoBiglietto: FormGroup;
  macrosettoriList: any;
  tipologieList;
  idTipologiaToModify: string;
  isModifica: boolean = false;
  tipologiaBigliettoToModify: any;
  inserimentoCombinati = false;

  constructor(
    private amministratoreService: AmministratoreApiService,
    private dialogRef: MatDialogRef<TipologiaBigliettoComponent>,
    public tipoBigliettoService: TipologiaBigliettoService,
    private loader: LoaderService,
    private readonly changeDetectorRef: ChangeDetectorRef

  ) { }

  ngOnInit(): void {
    this.loader.show();
    forkJoin([
      this.amministratoreService.getAllMacrosettori(),
      this.amministratoreService.getAllTipologieBiglietto()
      // this.amministratoreService.getAllDistributori(),
    ]).subscribe(
      ([macrosettori, tipologie]) => {
        this.macrosettoriList = macrosettori;
        this.tipologieList = tipologie.filter(x => x.macrosettore.nome != "Combinato");
        console.log("🚀 ~ file: tipologia-biglietto.component.ts ~ line 42 ~ TipologiaBigliettoComponent ~ ngOnInit ~ tipologie", tipologie)
        this.loader.hide();
      });
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  macroChanged() {
    console.log(this.tipoBigliettoService.formTipoBiglietto.value.macrosettore);
    let macrosettoreSelezionato = this.tipoBigliettoService.formTipoBiglietto.value.macrosettore;
    if(macrosettoreSelezionato && macrosettoreSelezionato.nome == "Combinato") {
        this.inserimentoCombinati = true;
    } else {
      this.inserimentoCombinati = false;
    }
  }

  submit() {
    if(!this.tipoBigliettoService.formTipoBiglietto.value.voucher){
      this.tipoBigliettoService.formTipoBiglietto.patchValue({ prezzoNettoInteroVoucher: '' });
      this.tipoBigliettoService.formTipoBiglietto.patchValue({ prezzoNettoRidottoVoucher: '' })
    }
    if(this.tipoBigliettoService.formTipoBiglietto.value.durata == null || this.tipoBigliettoService.formTipoBiglietto.value.durata == ""){
      this.tipoBigliettoService.formTipoBiglietto.value.durata = "Singolo timbro";
    }
    if(this.tipoBigliettoService.isModifica){
      this.tipoBigliettoService.modificaTipologia();

    }else{
      this.tipoBigliettoService.aggiungiTipologia();
    }
    this.close();
  }

  close() {
    this.tipoBigliettoService.formTipoBiglietto.reset();
    this.tipoBigliettoService.inizializeForm();
    this.dialogRef.close();
  }

  durataIsNull() {
    let durata = this.tipoBigliettoService.formTipoBiglietto.value.voucher;
    if(!durata || durata == "Singolo timbro") {
      return true;
    } else {
      return false;
    }
  }

  compareById( a, b ) : boolean {
    return a && b && a.id === b.id;
  }

}
