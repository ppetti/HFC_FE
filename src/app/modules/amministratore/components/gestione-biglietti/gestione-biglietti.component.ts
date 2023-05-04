import { Component, OnInit } from '@angular/core';
import { AmministratoreApiService } from '../../services/amministratore-api.service';
import { AmministartoreNavigationService } from '../../services/amministratore-navigation.service';
import { TipologiaBigliettoService } from '../../services/tipologia-biglietto.service';

@Component({
  selector: 'app-gestione-biglietti',
  templateUrl: './gestione-biglietti.component.html',
  styleUrls: ['./gestione-biglietti.component.scss']
})
export class GestioneBigliettiComponent implements OnInit {

  tipologiaInput: string;
  tipologiaListCopy: any[];

  constructor(
    public tipologiaService: TipologiaBigliettoService
  ) { }

  ngOnInit(): void {
    this.tipologiaService.showTipologiaBiglietto();
  }

  assignCopy(){
    this.tipologiaService.tipologiaBiglietto = Object.assign([], this.tipologiaService.tipologiaBigliettoCopy);
    // this.tipologiaService.tipologiaBiglietto = this.tipologiaService.tipologiaBiglietto.filter(x => x.)
  }

  filterItem(value){
    if(!value){
        this.assignCopy();
    }
    this.tipologiaService.tipologiaBiglietto = Object.assign([],  this.tipologiaService.tipologiaBigliettoCopy).filter(
       item => item.titolo.toLowerCase().indexOf(value.toLowerCase()) > -1
    )
  }

  clearInput() {
    this.tipologiaInput = '';
    this.filterItem('');
  }

}
