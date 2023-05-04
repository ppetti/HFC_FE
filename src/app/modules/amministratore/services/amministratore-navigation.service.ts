import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class AmministartoreNavigationService {

  constructor(
    private router: Router
  ) { }

  public goToGestioneClienti(): void {
    this.router.navigate(['amministratore/gestioneFornitori']);
  }

  public goToDashboard(): void {
    this.router.navigate(['amministratore/dashboard']);
  }
}
