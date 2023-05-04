export class ListinoPrezzi {

  distributore: any;
  constructor(distributore = {}) {
    this.distributore = distributore;
  }

}

export class ListinoPrezziWrapper {
  distributore: any;
  tipologiaBiglietto: any;

  constructor( distributore = {}, tipologiaBiglietto = {}, sconto = 0 ) {
    this.distributore = distributore;
    this.tipologiaBiglietto = tipologiaBiglietto;
  }

}

