export class TipologiaBiglietto {

  id: string;
  prezzo: string;
  durata: string;
  descrizione: string;
  titolo: string;
  prezzo_full: any;
  prezzo_child: any;
  buyCountAdult: number;
  buyCountChild: number;


  constructor(
    id = '',
    prezzo = '',
    durata = '',
    descrizione = '',
    titolo = '',
    ) {
      this.id = id;
      this.prezzo = prezzo;
      this.durata = durata;
      this.descrizione = descrizione;
      this.titolo = titolo;
    }
}
