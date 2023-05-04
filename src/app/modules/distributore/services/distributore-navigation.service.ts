import { Router } from '@angular/router';
import { Injectable } from '@angular/core';


@Injectable({
  providedIn: 'root'
})
export class DistributoreNavigationService {

  constructor(
    private router: Router
    ) { }

  goToCarrello(): void {
    this.router.navigate(['rivenditore/carrello']);
  }

  goToBiglietti(): void {
    this.router.navigate(['rivenditore/biglietti']);
  }

  goToRiepilogo(): void {
    this.router.navigate(['rivenditore/riepilogo']);
  }

  goToProfilo(): void {
    this.router.navigate(['rivenditore/profilo']);
  }

  goToSelezionaCliente(): void {
    this.router.navigate(['rivenditore/selezioneCliente']);
  }

  goToSelezionaMacrosettore(id): void {
    this.router.navigate(['rivenditore/selezionaMacrosettore'],{queryParams:{id}});
  }

  goToStampaBiglietti(): void {
    this.router.navigate(['rivenditore/stampaBiglietti']);
  }
}
