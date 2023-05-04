import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoaderService } from '@Src/app/loader/loader.service';
import { AmministratoreApiService } from './amministratore-api.service';

@Injectable({
  providedIn: 'root'
})
export class TipologiaBigliettoService {

  formTipoBiglietto: FormGroup;
  isModifica: boolean = false;
  idTipologiaToEdit: string;
  tipologiaBiglietto: any[];
  tipologiaBigliettoCopy: any[];

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

  createForm() {
    this.formTipoBiglietto = this.fb.group({
      titolo: ['', Validators.required],
      descrizione: [''],
      durata: [''],
      prezzo_full: [''],
      prezzo_child: [''],
      macrosettore: [null, Validators.required],
      bigliettiList: [[]],
      prezziList: [[]],
      tipologia1: [''],
      tipologia2: [''],
      // tipologia1: ['',[this.requiredIfValidator(() => this.formTipoBiglietto.get('macrosettore').value?.nome == "Combinato") ]],
      // tipologia2: ['',[this.requiredIfValidator(() => this.formTipoBiglietto.get('macrosettore').value?.nome == "Combinato") ]],
      passeggeriPerBiglietto: [''],
      voucher: [false],
      prezzoNettoInteroVoucher: ['',[this.requiredIfValidator(() => this.formTipoBiglietto.get('voucher').value) ]],
      prezzoNettoRidottoVoucher: ['',[this.requiredIfValidator(() => this.formTipoBiglietto.get('voucher').value) ]],
    })
  }

  requiredIfValidator(predicate) {

    return (formControl => {
      if (!formControl.parent) {
        return null;
      }
      if (predicate()) {
        return Validators.required(formControl);

      }
      return null;
    })
  }

  inizializeForm() {
    this.isModifica = false;
    this.formTipoBiglietto.setValue({
      titolo: '',
      descrizione: '',
      durata: '',
      prezzo_full: '',
      prezzo_child: '',
      macrosettore: null,
      tipologia1: null,
      tipologia2: null,
      bigliettiList: [],
      prezziList: [],
      passeggeriPerBiglietto: '',
      voucher: false,
      prezzoNettoInteroVoucher: '',
      prezzoNettoRidottoVoucher: '',
    });
  }

  populateForm(tipologiaBiglietto) {
    this.isModifica = true;
    this.idTipologiaToEdit = tipologiaBiglietto.id
    this.formTipoBiglietto.get('titolo').setValue(tipologiaBiglietto.titolo)
    this.formTipoBiglietto.get('descrizione').setValue(tipologiaBiglietto.descrizione)
    this.formTipoBiglietto.get('durata').setValue(tipologiaBiglietto.durata)
    this.formTipoBiglietto.get('prezzo_full').setValue(tipologiaBiglietto.prezzo_full)
    this.formTipoBiglietto.get('prezzo_child').setValue(tipologiaBiglietto.prezzo_child)
    this.formTipoBiglietto.get('macrosettore').setValue(tipologiaBiglietto.macrosettore)
    this.formTipoBiglietto.get('tipologia1').setValue(tipologiaBiglietto.tipologia1)
    this.formTipoBiglietto.get('tipologia2').setValue(tipologiaBiglietto.tipologia2)
    this.formTipoBiglietto.get('passeggeriPerBiglietto').setValue(tipologiaBiglietto.passeggeriPerBiglietto)
    this.formTipoBiglietto.get('voucher').setValue(tipologiaBiglietto.voucher)
    this.formTipoBiglietto.get('prezzoNettoInteroVoucher').setValue(tipologiaBiglietto.prezzoNettoInteroVoucher)
    this.formTipoBiglietto.get('prezzoNettoRidottoVoucher').setValue(tipologiaBiglietto.prezzoNettoRidottoVoucher)
  }

  modificaTipologia() {
    this.loader.show();
    let tipologiaToEdit = {...this.formTipoBiglietto.value};
    this.amministratoreService.updateTipologiaBiglietto(this.idTipologiaToEdit, tipologiaToEdit).subscribe(
      res => {
        this.loader.hide();
        this.openSnackBar(res.messaggio, 'chiudi');

      },
      err => console.log('err', err)
    )
  }

  aggiungiTipologia() {
    this.loader.show();
    let tipoBigliettoToInsert = {...this.formTipoBiglietto.value};
    if(tipoBigliettoToInsert.macrosettore.nome == "Combinato") {
      tipoBigliettoToInsert.combinazione = { tipologia1: tipoBigliettoToInsert.tipologia1, tipologia2: tipoBigliettoToInsert.tipologia2 }
    }
    this.amministratoreService.addTipologiaBiglietto(tipoBigliettoToInsert).subscribe(
      res => {
      this.loader.hide();
      this.openSnackBar(res.messaggio, 'chiudi')},
      err => console.log(err)
    )
  }

  public showTipologiaBiglietto(): any {
    this.loader.show();
    this.amministratoreService.getAllTipologieBiglietto().subscribe(
      tipologia => {
        this.tipologiaBiglietto = tipologia;
        this.tipologiaBigliettoCopy = this.tipologiaBiglietto;
        this.loader.hide();
      }
    )
  }
}
