import { Router } from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class CoreNavigationService {

  constructor(
    private router: Router) { }

  goToLogin(): void {
    this.router.navigate(['/login']);
  }

  goToHome(): void {
    this.router.navigate(['/home']);
  }

  goToBiglietti(): void {
    this.router.navigate(['rivenditore/biglietti']);
  }
  goToSceltaCliente(): void {
    this.router.navigate(['rivenditore/selezioneCliente']);
  }
  goToDashboard(): void {
    this.router.navigate(['amministratore/dashboard']);
  }
  goToCambiaPassword(username): void {
    this.router.navigate(['utente/cambiaPassword'])
  }
  goToSelezionaFunzione(): void {
    this.router.navigate(['operatoreInterno/selezionaFunzione']);
  }
  goToProfilo(): void {
    this.router.navigate(['utente/profilo']);
  }

}
