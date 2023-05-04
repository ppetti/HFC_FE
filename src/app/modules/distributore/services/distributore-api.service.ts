import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CrudService } from '@Src/app/core/services/crud.service';

@Injectable({
  providedIn: 'root'
})
export class DistributoreApiService {

  constructor(private crudService: CrudService) {
  }

  public getTipologie(): Observable<any> {
    return this.crudService.selectAll(`tipologieBiglietto`);
  }

  public getClienti(): Observable<any> {
    return this.crudService.selectAll(`clienti`);
  }

  public getMacrosettori(id): Observable<any> {
    return this.crudService.selectAll(`macrosettori/cliente/${id}`);
  }

  public getTipologieBiglietto(id): Observable<any> {
    return this.crudService.selectAll(`tipologieBiglietto/macrosettore/${id}`);
  }

  public cambiaPassword(username, nuovaPassword): Observable<any> {
    return this.crudService.modifyWithoutID(`utenti/${username}/cambiaPassword`,nuovaPassword);
  }

  // public chiusuraAlreadyPresent(id): Observable<any> {
  //   return this.crudService.selectOne(`chiusura/distributore`, id);
  // }

  public chiusuraAlreadyPresent(id, wrapper): Observable<any> {
    return this.crudService.save(`chiusura/distributore/${id}`, wrapper);
  }

  public bigliettiVendutiGiornalieri(id): Observable<any> {
    return this.crudService.selectOne(`bigliettiVenduti/distributore`, id);
  }

  public getZplFromBigliettoId(id): Observable<any> {
    return this.crudService.selectOneAsByteArray(`biglietti`, id);
  }

  public getDistributoreById(id): Observable<any> {
    return this.crudService.selectOne(`distributori`, id);
  }

  public getChiusuraById(id): Observable<any> {
    return this.crudService.selectOne(`chiusura`, id);
  }

  public bigliettiDisponibili(tipologiaBiglietto, id): Observable<any> {
    return this.crudService.save(`bigliettoDisponibile/utente/${id}`, tipologiaBiglietto);
  }

  public sbloccaBiglietti(bigliettiList, id): Observable<any> {
    return this.crudService.save(`bigliettoSblocca/utente/${id}`, bigliettiList);
  }

  public acquistaBiglietti(bigliettiList): Observable<any> {
    return this.crudService.save(`acquistaBiglietto`, bigliettiList);
  }

  public addBigliettiVenduti(bigliettiVenduti, id): Observable<any> {
    return this.crudService.save(`bigliettiVenduti/utente/${id}`, bigliettiVenduti);
  }

  public generateZpl(wrapperList): Observable<any> {
    return this.crudService.save(`generazione/biglietto`, wrapperList);
  }

  // public addChiusura(id): Observable<any> {
  //   return this.crudService.selectOne(`inserisci/chiusura/utente`, id)
  // }

  public addChiusura(id, wrapper): Observable<any> {
    return this.crudService.save(`inserisci/chiusura/utente/${id}`, wrapper)
  }

  public sottraiCredito(id, ammontare) {
    return this.crudService.modify(`sottraiCredito/distributori`, id, ammontare)
  }

  public getAllGruppi() {
    return this.crudService.selectAll(`gruppi`)
  }

  public getMacrosettoriDistributore(id): Observable<any> {
    return this.crudService.selectAll(`macrosettori/cliente/distributore/${id}`);
  }

  public getStripePublicKey(): Observable<any> {
    return this.crudService.selectAll(`stripePublicKey`);
  }

  public chargeWithStripe(tokenObj): Observable<any> {
    return this.crudService.save(`chargeViaStripe`, tokenObj);
  }

  public editDistributore(distributore): Observable<any> {
    return this.crudService.save(`simpleNoUtente/distributori`, distributore);
  }

  public stripeOpenSession(sessionObj): Observable<any> {
    return this.crudService.save(`checkoutSession`, sessionObj);
  }

  public getSecretPaymentIntent(sessionObj): Observable<any> {
    return this.crudService.save(`secret/paymentIntent`, sessionObj);
  }

  public getSecretPaymentIntentVenditaDistributore(bigliettiVenduti): Observable<any> {
    return this.crudService.save(`secret/distributore/paymentIntent`, bigliettiVenduti);
  }

  public annullaAcquistoBiglietti(bigliettiList): Observable<any> {
    return this.crudService.save(`annullaVenditaBiglietti`, bigliettiList);
  }

  public addBigliettiVendutiConRitorno(bigliettiVenduti, id): Observable<any> {
    return this.crudService.save(`bigliettiVendutiRitornati/utente/${id}`, bigliettiVenduti);
  }

  public annullaCreazioneBigliettiVenduti(bigliettiList): Observable<any> {
    return this.crudService.save(`bigliettiVenduti/elimina`, bigliettiList);
  }

  public sottraiCreditoSafe(id, bigliettiList) {
    return this.crudService.modify(`sottraiCreditoSafe/distributori`, id, bigliettiList)
  }

  public getAllFermate(): Observable<any> {
    return this.crudService.selectAll(`fermate`)
  }

  public getFermataById(id): Observable<any> {
    return this.crudService.selectOne(`fermate`, id);
  }

}
