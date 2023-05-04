export const MENU_LIST_ITEMS_ADMIN = () => {
  return [
    {
      title: 'Dashboard',
      icon: 'dashboard',
      route: 'amministratore/dashboard'
    },
    {
      title: 'Gestione utenti',
      icon: 'list_alt',
      route: 'amministratore/gestioneUtenti'
    },
    {
      title: 'Gestione prodotti',
      icon: 'arrow_drop_down',
      //route: 'amministratore/gestioneProdotti',
      childrens: [
        {
          title: 'Tipologie biglietti',
          icon: 'list_alt',
          route: 'amministratore/gestioneProdotti'
        },
        // {
        //   title: 'Fornitori',
        //   icon: 'list_alt',
        //   route: 'amministratore/gestioneFornitori'
        // },
        {
          title: 'Macrocategorie',
          icon: 'list_alt',
          route: 'amministratore/gestioneMacrocategorie'
        }

      ]
    },
    {
      title: 'Invio notifiche',
      icon: 'send',
      route: 'amministratore/invioNotifiche'
    },
    {
      title: 'Gestione Listini',
      icon: 'send',
      route: 'amministratore/gestioneListini'
    },
    {
      title: 'Amministrazione',
      icon: 'arrow_drop_down',
      //route: 'amministratore/gestioneProdotti',
      childrens: [
        {
          title: 'Correzione Vendite',
          icon: 'list_alt',
          route: 'amministratore/correzioneVendite'
        },
        {
          title: 'Report Fermate',
          icon: 'list_alt',
          route: 'amministratore/scaricoExcelFermate'
        }
      ]
    },
    {
      title: 'Magazzino biglietti cartacei',
      icon: 'arrow_drop_down',
      //route: 'amministratore/gestioneProdotti',
      childrens: [
        {
          title: 'Creazione biglietti cartacei',
          icon: 'list_alt',
          route: 'amministratore/creazioneBigliettiCartacei'
        },
        {
          title: 'Assegnazione biglietti cartacei',
          icon: 'list_alt',
          route: 'amministratore/assegnazioneBigliettiCartacei'
        },
        {
          title: 'Disponibilità per distributori',
          icon: 'list_alt',
          route: 'amministratore/disponibilitaCartaceaDistributori'
        }
      ]
    },
    {
      title: 'Gestione biglietti bianchi',
      icon: 'arrow_drop_down',
      //route: 'amministratore/gestioneProdotti',
      childrens: [
        {
          title: 'Creazione biglietti bianchi',
          icon: 'list_alt',
          route: 'amministratore/creazioneBigliettiBianchi'
        },
        {
          title: 'Assegnazione biglietti bianchi',
          icon: 'list_alt',
          route: 'amministratore/assegnazioneBigliettiBianchi'
        },
        {
          title: 'Registrazione biglietti bianchi venduti',
          icon: 'list_alt',
          route: 'amministratore/registrazioneBigliettiBianchiVenduti'
        }
      ]
    },
  ];
};

export const MENU_LIST_ITEMS_DIST = () => {
  return [
    {
      title: 'Acquista biglietti',
      icon: 'store',
      route: 'rivenditore/selezioneCliente'
    },
    {
      title: 'Carrello',
      icon: 'shopping_cart',
      route: 'rivenditore/carrello'
    },
    {
      title: 'Profilo',
      icon: 'account_box',
      route: 'utente/profilo'
    },
    {
      title: 'Salda credito',
      icon: 'receipt_long',
      route: 'rivenditore/saldaCredito'
    },
    {
      title: 'Chiusura giornaliera',
      icon: 'receipt',
      route: 'rivenditore/chiusuraGiornaliera'
    }
  ];
};

export const MENU_LIST_ITEMS_DIST_NON_ABITUALE = () => {
  return [
    {
      title: 'Acquista biglietti',
      icon: 'store',
      route: 'rivenditore/selezioneCliente'
    },
    {
      title: 'Carrello',
      icon: 'shopping_cart',
      route: 'rivenditore/carrello'
    },
    {
      title: 'Profilo',
      icon: 'account_box',
      route: 'utente/profilo'
    },
    {
      title: 'Chiusura giornaliera',
      icon: 'receipt',
      route: 'rivenditore/chiusuraGiornaliera'
    }
  ];
};

export const MENU_LIST_ITEMS_VALID = () => {
  return [
    {
      title: 'Home',
      icon: 'home',
      route: 'operatoreInterno/selezionaFunzione'
    },
    {
      title: 'QR Code',
      icon: 'qr_code_scanner',
      route: 'operatoreInterno/scanner'
    },
    {
      title: 'Acquista biglietti',
      icon: 'store',
      route: 'operatoreInterno/selezioneCliente'
    },
    {
      title: 'Carrello',
      icon: 'shopping_cart',
      route: 'operatoreInterno/carrello'
    },
    {
      title: 'Profilo',
      icon: 'account_box',
      route: 'utente/profilo'
    },
    {
      title: 'Chiusura giornaliera',
      icon: 'receipt',
      route: 'operatoreInterno/chiusuraGiornaliera'
    },
    {
      title: 'Dati Giornata',
      icon: 'assignment',
      route: 'operatoreInterno/datiGiornarta'
    }
  ];
};

export const MENU_LIST_ITEMS_NOAUTH = () => {
  return [];
};

export const MENU_LIST_ITEMS_SUPERVISORE = () => {
  return [{
      title: 'Dashboard',
      icon: 'dashboard',
      route: 'amministratore/dashboard'
    }];
};
