import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ChiusuraService {

  utente: any;
  constructor() { }

  getUtente() {
    return this.utente;
  }

  setUtente(utente) {
    this.utente = utente;
  }
}
