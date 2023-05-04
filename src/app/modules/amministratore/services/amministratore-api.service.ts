import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CrudService } from '@Src/app/core/services/crud.service';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AmministratoreApiService {

  constructor(private crudService: CrudService,
    private http: HttpClient) {
  }

  public getAllUtenti(): Observable<any> {
    return this.crudService.selectAll(`utenti`);
  }

  public removeUtente(id): Observable<any> {
    return this.crudService.delete(`utenti`, id);
  }

  public resetPassword(id): Observable<any> {
    return this.crudService.selectAll(`utenti/${id}/resetPassword`);
  }

  public cambiaStato(id, stato): Observable<any> {
    return this.crudService.modifyWithoutID(`utenti/${id}/cambiaStato`, stato);
  }

  public getAllRuoli(): Observable<any> {
    return this.crudService.selectAll(`ruoli`);
  }

  public addUtente(utente): Observable<any> {
    return this.crudService.save(`utenti`, utente);
  }

  public editUtente(id, utente): Observable<any> {
    return this.crudService.modify(`utenti`, id, utente);
  }

  public getAllTipologieBiglietto(): Observable<any> {
    return this.crudService.selectAll(`tipologieBiglietto`);
  }

  public getAllMacrosettori(): Observable<any> {
    return this.crudService.selectAll(`macrosettori`);
  }

  public getAllClienti(): Observable<any> {
    return this.crudService.selectAll(`clienti`);
  }

  public removeTipologiaBiglietto(id): Observable<any> {
    return this.crudService.delete(`tipologieBiglietto`, id)
  }

  public addTipologiaBiglietto(tipologiaBiglietto): Observable<any> {
    return this.crudService.save(`tipologieBiglietto`, tipologiaBiglietto);
  }

  public updateTipologiaBiglietto(id, tipologiaBiglietto): Observable<any> {
    return this.crudService.modify(`tipologieBiglietto`, id, tipologiaBiglietto)
  }

  public removeCliente(id): Observable<any> {
    return this.crudService.delete(`clienti`, id);
  }

  public addCliente(fornitore): Observable<any> {
    return this.crudService.save(`clienti`, fornitore);
  }

  public updateCliente(id, fornitore): Observable<any> {
    return this.crudService.modify(`clienti`, id, fornitore);
  }

  public removeMacrosettore(id): Observable<any> {
    return this.crudService.delete(`macrosettori`, id);
  }

  public addMacrocategoria(macrocategoria): Observable<any> {
    return this.crudService.save(`macrosettori`, macrocategoria);
  }

  public addAmministratore(amministratore): Observable<any> {
    return this.crudService.save('amministratori', amministratore);
  }

  public addSupervisore(amministratore): Observable<any> {
    return this.crudService.save('supervisori', amministratore);
  }

  public addDistributore(distributore): Observable<any> {
    return this.crudService.save('distributori', distributore)
  }

  public getDistributoreById(id): Observable<any> {
    return this.crudService.selectOne(`distributori`, id);
  }

  public getAllDistributori(): Observable<any> {
    return this.crudService.selectAll('distributori');
  }

  public generaListinoPrezzi(listinoPrezziWrapper) {
    return this.crudService.save('listinoprezzi', listinoPrezziWrapper)
  }

  public modificaListinoPrezzi(id, listinoPrezzi) {
    return this.crudService.modify('listinoprezzi', id, listinoPrezzi)
  }

  public getListinoprezziByDistributore(idDistributore): Observable<any> {
    return this.crudService.selectOne(`listinoprezzi/distributore`, idDistributore)
  }

  public editDistributore(id, distributore): Observable<any> {
    return this.crudService.modify(`distributori`, id, distributore);
  }

  public removeDistributore(id): Observable<any> {
    return this.crudService.delete(`distributori`, id);
  }

  public removeAmministratore(id): Observable<any> {
    return this.crudService.delete('amministratori', id);
  }

  public removeValidatore(id): Observable<any> {
    return this.crudService.delete('validatore', id);
  }

  public getAllBigliettiVendutiData(): Observable<any> {
    return this.crudService.selectAll(`bigliettiVenduti/ultime24h`);
  }

  public addBiglietti(listaBiglietti): Observable<any> {
    return this.crudService.save(`biglietto`, listaBiglietti);
  }

  public getBigliettiVendutiPerMacrosettore(data): Observable<any> {
    return this.crudService.save(`bigliettiVenduti/macrosettore`, data);
  }

  public getBigliettiVendutiPerTipologia(wrapper): Observable<any> {
    return this.crudService.save(`bigliettiVenduti/tipologia`, wrapper);
  }

  public getBigliettiVendutiPerTipologiaFiltrati(wrapper): Observable<any> {
    return this.crudService.save(`bigliettiVenduti/filtrati`, wrapper);
  }

  public getBigliettiValidatiFiltrati(wrapper): Observable<any> {
    return this.crudService.save(`bigliettiValidati/filtrati`, wrapper);
  }

  public getBigliettiVendutiUtenteData(id, wrapper): Observable<any> {
    return this.crudService.save(`bigliettiVenduti/data/utente/${id}`, wrapper);
  }

    public getBigliettiVendutiPerTipologiaFiltratiNoTours(wrapper): Observable<any> {
      return this.crudService.save(`bigliettiVenduti/filtratiNoTours`, wrapper);
    }

    public getBigliettiVendutiTours(wrapper): Observable<any> {
      return this.crudService.save(`bigliettiVenduti/tours`, wrapper);
    }

    public getBigliettiValidatiOta(wrapper): Observable<any> {
      return this.crudService.save(`bigliettiValidati/ota`, wrapper);
    }

    public getAllBigliettiVendutiValidatiDataFiltrati(wrapper): Observable<any> {
      return this.crudService.save(`bigliettiVendutiValidati/filtrati`, wrapper);
    }
  public checkChiusuraUtenteData(id, wrapper): Observable<any> {
    return this.crudService.save(`chiusura/utente/${id}`, wrapper);
  }

  public getAllValidatori(): Observable<any> {
    return this.crudService.selectAll(`validatore`);
  }

  public addValidatori(validatore): Observable<any> {
    return this.crudService.save(`validatore`, validatore)
  }

  public getAllTipologieBigliettoDimensionale(): Observable<any> {
    return this.crudService.selectAll(`tipologieBiglietto/dimensionale`);
  }

  public getAllTipologieBigliettoDimensionaleNoTours(): Observable<any> {
    return this.crudService.selectAll(`tipologieBiglietto/dimensionaleNoTours`);
  }

  public getVenditoriAttivi(dataDa, dataA, attivoFlag): Observable<any> {
    return this.crudService.selectAll(`dettaglioAttivitaDistributori` + '?dataDa=' + dataDa + '&dataA=' + dataA + '&attivoFlag=' + attivoFlag);
  }

  public inviaNotificaDistributori(wrapper): Observable<any> {
    return this.crudService.save(`distributori/invioNotifica`, wrapper);
  }

  public inviaNotificaValidatori(wrapper): Observable<any> {
    return this.crudService.save(`validatori/invioNotifica`, wrapper);
  }

  public getOperatoriAttivi(dataDa, dataA, attivoFlag): Observable<any> {
    return this.crudService.selectAll(`validatore/attivi` + '?dataDa=' + dataDa + '&dataA=' + dataA + '&attivoFlag=' + attivoFlag);
  }

  public getVendutiValidati(): Observable<any> {
    return this.crudService.selectAll(`dettaglioVendutiValidati/odierno`);
  }

  // public checkChiusuraUtenteData(id, wrapper): Observable<any> {
  //   return this.crudService.save(`chiusura/utente/${id}`, wrapper);
  // }

  public addChiusura(id, wrapper): Observable<any> {
    return this.crudService.save(`inserisci/chiusura/utente/${id}`, wrapper)
  }

  public generateExcelBigliettiNumericiVenduti(wrapper): Observable<any> {
    return this.crudService.save(`bigliettiVenduti/excelVenduti`, wrapper);
  }

  public generateExcelBigliettiValidatiOta(wrapper): Observable<any> {
    return this.crudService.save(`bigliettiValidatiOta/excel`, wrapper);
  }


  public generateExcelBigliettiNumericiValidati(wrapper): Observable<any> {
    return this.crudService.save(`bigliettiValidati/excelInterni`, wrapper);
  }

  public generateExcelBigliettiValoreVenduti(wrapper): Observable<any> {
    return this.crudService.save(`bigliettiVenduti/excelTotaleVendite`, wrapper);
  }

  public getAllBigliettiVendutiFiltratiOperatore(wrapper): Observable<any> {
    return this.crudService.save(`bigliettiVenduti/filtrati/operatore`, wrapper);
  }

  public deleteBigliettoVenduto(id): Observable<any> {
    return this.crudService.delete(`bigliettoVenduto`, id);
  }

  public generaBigliettiCartacei(wrapper): Observable<any> {
    return this.crudService.save(`generaBigliettiCartacei`, wrapper);
  }

  public generaExcelBigliettiCartacei(wrapper): Observable<any> {
    return this.crudService.save(`generaExcelBigliettiCartacei`, wrapper);
  }

  public generaZplCartacei(wrapper): Observable<any> {
    return this.crudService.save(`generaZplCartacei`, wrapper);
  }

  public generaBigliettiBianchi(wrapper): Observable<any> {
    return this.crudService.save(`generaBigliettiBianchi`, wrapper);
  }

  public getAllgeneraBigliettiCartacei(): Observable<any> {
    return this.crudService.selectAll(`getAll/generaBigliettiCartacei`);
  }

  public getAllDistributoriOta(): Observable<any> {
    return this.crudService.selectAll(`getAll/distributoriOta`);
  }

  public getAllgeneraBigliettiBianchi(): Observable<any> {
    return this.crudService.selectAll(`getAll/generaBigliettiBianchi`);
  }

  public assegnaBigliettiCartacei(wrapper): Observable<any> {
    return this.crudService.save(`assegnaBigliettiCartacei`, wrapper);
  }

  public getBigliettiCartaceiDisponibili(wrapper): Observable<any> {
    return this.crudService.save(`bigliettiCartaceiDisponibili`, wrapper);
  }

  public getBigliettiCartaceiDistributori(): Observable<any> {
    return this.crudService.selectAll(`bigliettiCartaceiDistributori`);
  }

  public getBigliettiValidatiUtenteData(id, wrapper): Observable<any> {
    return this.crudService.save(`bigliettiPerValidatore/admin/${id}`, wrapper);
  }

  public getBigliettiBianchiValidatori(): Observable<any> {
    return this.crudService.selectAll(`bigliettiBianchiValidatori`);
  }

  public getBigliettiBianchiDisponibili(): Observable<any> {
    return this.crudService.selectAll(`bigliettiBianchiDisponibili`);
  }

  public assegnaBigliettiBianchi(wrapper): Observable<any> {
    return this.crudService.save(`assegnaBigliettiBianchi`, wrapper);
  }

  public registraBigliettiBianchi(wrapper): Observable<any> {
    return this.crudService.save(`registraBigliettiBianchi`, wrapper);
  }

  public generaPdfBigliettiBianchi(wrapper): Observable<any> {
    return this.crudService.save(`generaPdfBigliettiBianchi`, wrapper);
  }

  public getAllTipologieBigliettoTest(): Observable<any> {
    return this.crudService.selectAll(`ticketTypeOpenBus`);
  }

  public getAllBigliettiVendutiTour24(): Observable<any> {
    return this.crudService.selectAll(`bigliettiTour/ultime24h`);
  }

  public getAllBigliettiValidatiOta(): Observable<any> {
    return this.crudService.selectAll(`bigliettiValidati/otaUltime24h`);
  }

  public getPasseggeriFiltrati(wrapper): Observable<any> {
    return this.crudService.save(`passeggeri/filtrati`, wrapper);
  }

  public generateExcelPasseggeriFiltrati(wrapper): Observable<any> {
    return this.crudService.save(`filtrati/PasseggeriExcel`, wrapper);
  }

  public getTipologieBigliettoNoGruppi(): Observable<any> {
    return this.crudService.selectAll(`tipologieBiglietto/noGruppi`);
  }

  public getExcelFermatePerValidatore(id, wrapperData): Observable<any> {
    // return this.crudService.selectOne(`chiusura/fermate`, id);
    return this.http.post(`chiusura/fermate/${id}`,wrapperData, {
      responseType: 'blob'
    });
  }

  public getExcelFermateTotale(wrapper): Observable<any> {
    // return this.crudService.selectOne(`chiusura/fermate`, id);
    return this.http.post(`chiusura/operatori`, wrapper, {
      responseType: 'blob'
    });
  }

  public getAllBigliettiVendutiValidatiReteDataFiltrati(wrapper): Observable<any> {
    return this.crudService.save(`bigliettiVendutiRete`, wrapper);
  }

  public checkDatiGiornalieriUtenteData(id, wrapper): Observable<any> {
    return this.crudService.save(`getOne/datiGiornalieri/operatore/${id}`, wrapper);
  }

  public getBigliettiValidatiWaveUtenteData(id, wrapper): Observable<any> {
    return this.crudService.save(`bigliettiWavePerValidatore/admin/${id}`, wrapper);
  }

  public getBigliettiValidatiWave(wrapper): Observable<any> {
    return this.crudService.save(`bigliettiWaveValidati`, wrapper);
  }

  public generateExcelBigliettiValidatiOtaPerTipologia(wrapper): Observable<any> {
    return this.crudService.save(`bigliettiValidati/ota/excelTipologia`, wrapper);
  }
}
