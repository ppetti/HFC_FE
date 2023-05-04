import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ScannerService {

  infoQR: any;
  fermata: any;
  giro: any;

  constructor() { }

  getInfoQR() {
    return this.infoQR;
  }

  setInfoQR(infoQR) {
    this.infoQR = infoQR;
  }

  getFermata() {
    return this.fermata;
  }

  setFermata(fermata) {
    this.fermata = fermata;
  }

  getGiro() {
    return this.giro;
  }

  setGiro(giro) {
    this.giro = giro;
  }

}
