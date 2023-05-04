import { Injectable } from '@angular/core';
import { CrudService } from '@Src/app/core/services/crud.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ValidatoreApiService {

  constructor(private crudService: CrudService) { }

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
    return this.crudService.modifyWithoutID(`utenti/${username}/cambiaPassword`, nuovaPassword);
  }

  // public chiusuraAlreadyPresent(id): Observable<any> {
  //   return this.crudService.selectOne(`chiusura/validatore`, id);
  // }

  public chiusuraAlreadyPresent(id, wrapper): Observable<any> {
    return this.crudService.save(`chiusura/validatore/${id}`, wrapper);
  }

  public bigliettiVendutiGiornalieri(id): Observable<any> {
    return this.crudService.selectOne(`bigliettiVenduti/validatore`, id);
  }

  public getZplFromBigliettoId(id): Observable<any> {
    return this.crudService.selectOneAsByteArray(`biglietti`, id);
  }

  public getZplFromBigliettoWave(id): Observable<any> {
    return this.crudService.selectOneAsByteArray(`bigliettiWave`, id);
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

  public addBigliettiVendutiGruppo(bigliettiVenduti, id): Observable<any> {
    return this.crudService.save(`bigliettiVenduti/gruppo/utente/${id}`, bigliettiVenduti);
  }

  public generateZpl(wrapperList): Observable<any> {
    return this.crudService.save(`generazione/biglietto`, wrapperList);
  }

  public generateZplEventi(wrapperList): Observable<any> {
    return this.crudService.save(`generazione/biglietto/eventi`, wrapperList);
  }

  // public addChiusura(id): Observable<any> {
  //   return this.crudService.selectOne(`inserisci/chiusura/utente`, id);
  // }

  public addChiusura(id, wrapper): Observable<any> {
    return this.crudService.save(`inserisci/chiusura/utente/${id}`, wrapper)
  }

  public getBigliettoById(id): Observable<any> {
    return this.crudService.selectOne(`biglietto`, id);
  }

  public getBigliettoByTicketNumber(tn): Observable<any> {
    return this.crudService.selectOne(`bigliettoByTN`, tn);
  }

  public getDatiBigliettoWave(wrapper): Observable<any> {
    return this.crudService.save('bigliettoWave', wrapper)
  }

  public validaBiglietto(id,biglietto): Observable<any> {
    return this.crudService.save(`validaBiglietto/${id}`, biglietto);
  }

  public getAllGruppi() {
    return this.crudService.selectAll(`gruppi`)
  }

  public getValidatoreById(id): Observable<any> {
    return this.crudService.selectOne(`validatori`, id);
  }

  public getBigliettiTimbrati(id): Observable<any> {
    return this.crudService.selectAll(`bigliettiPerValidatore/${id}`);
  }

  public getAllFermate():Observable<any> {
    return this.crudService.selectAll(`fermate`)
  }

  public getFermataById(id): Observable<any> {
    return this.crudService.selectOne(`fermate`, id);
  }

  public getAllGiri(): Observable<any> {
    return this.crudService.selectAll(`giri`)
  }

  public getGiroById(id): Observable<any> {
    return this.crudService.selectOne(`giri`, id);
  }

  public getAllAutisti(): Observable<any> {
    return this.crudService.selectAll(`autisti`)
  }

  public getAllBus(): Observable<any> {
    return this.crudService.selectAll(`bus`)
  }

  public getAllTipiTurni(): Observable<any> {
    return this.crudService.selectAll(`tipiTurni`)
  }

  public datiGiornalieriAlreadyPresent(id, wrapper): Observable<any> {
    return this.crudService.save(`datiGiornalieri/operatore/${id}`, wrapper);
  }

  public addDatiGiornalieriOperatore(id, wrapper): Observable<any> {
    return this.crudService.save(`inserisci/datiGiornalieri/utente/${id}`, wrapper)
  }

  public checkDatiGiornalieriUtenteData(id, wrapper): Observable<any> {
    return this.crudService.save(`getOne/datiGiornalieri/operatore/${id}`, wrapper);
  }

  public getAllDistributoriOta(): Observable<any> {
    return this.crudService.selectAll(`getAll/distributoriOta`)
  }

  public getBigliettiWavePerValidatore(id): Observable<any> {
    return this.crudService.selectOne(`bigliettiWavePerValidatore`, id);
  }


}
