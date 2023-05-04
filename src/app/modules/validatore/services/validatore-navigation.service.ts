import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class ValidatoreNavigationService {

  constructor(private router: Router) { }

  goToCarrello(): void {
    this.router.navigate(['operatoreInterno/carrello']);
  }

  goToBiglietti(): void {
    this.router.navigate(['operatoreInterno/biglietti']);
  }

  goToRiepilogo(): void {
    this.router.navigate(['operatoreInterno/riepilogo']);
  }

  goToProfilo(): void {
    this.router.navigate(['operatoreInterno/profilo']);
  }

  goToSelezionaCliente(): void {
    this.router.navigate(['operatoreInterno/selezioneCliente']);
  }

  goToSelezionaMacrosettore(id): void {
    this.router.navigate(['operatoreInterno/selezionaMacrosettore'],{queryParams:{id}});
  }

  goToStampaBiglietti(): void {
    this.router.navigate(['operatoreInterno/stampaBiglietti']);
  }

  goToHome(): void {
    this.router.navigate(['operatoreInterno/selezionaFunzione']);
  }

  goToScanner(): void {
    this.router.navigate(['operatoreInterno/scanner']);
  }

  goToScannerResult(): void {
    this.router.navigate(['operatoreInterno/riepilogoScanner']);
  }

}
