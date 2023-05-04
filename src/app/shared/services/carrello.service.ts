import { TipologiaBiglietto } from './../../core/models/tipologia-biglietto';
import { Inject, Injectable } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';

@Injectable({
  providedIn: 'root'
})
export class CarrelloService {

  private carrelloObj = new Subject<TipologiaBiglietto[]>();
  private prezzoCliente: number;
  private prezzoRivenditore: number;
  private bigliettiSelezionati: any[];

  constructor(
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,

  ) { }

  public getCarrello(): Observable<any> {
    return this.carrelloObj.asObservable();
  }

  public getCarrelloItems(): void {
    this.locStorage.get('carrello') ? this.carrelloObj.next(JSON.parse(this.locStorage.get('carrello'))) : [];
  }

  public refreshCarrello(newCarrello: TipologiaBiglietto[]): void {
    this.locStorage.set('carrello', JSON.stringify(newCarrello));
    this.getCarrelloItems();
  }

  // public refreshCarrello(newCarrello: TipologiaBiglietto[]): void {
  //   console.log(newCarrello, 'aoooooooooooo')
  //   let listaTest = [];
  //   newCarrello.forEach(el => {
  //     let obj = {id: el.id,}
  //   })
  //   this.locStorage.set('carrello', JSON.stringify(listaTest));
  //   this.getCarrelloItems();
  // }


  public setPrezzi(prezzoCliente, prezzoRivenditore) {
    this.prezzoCliente = prezzoCliente;
    this.prezzoRivenditore = prezzoRivenditore
  }

  public getPrezzoRivenditore() {
    return this.prezzoRivenditore;
  }

  public getPrezzoCliente() {
    return this.prezzoCliente;
  }

  public setBiglietti(bigliettiList) {
    this.bigliettiSelezionati = bigliettiList;
  }

  public getBigliettiSelezionati() {
    return this.bigliettiSelezionati;
  }

}
