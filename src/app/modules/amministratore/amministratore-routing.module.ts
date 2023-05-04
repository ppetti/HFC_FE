import { StackedAreaChartComponent } from './components/grafici/stacked-area-chart/stacked-area-chart.component';
import { CommonModule, DatePipe } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@Src/app/shared/material.module';
import { SharedModule } from '@Src/app/shared/shared.module';
import { DashboardComponent } from './views/dashboard/dashboard.component';
import { GestioneUtentiComponent } from './views/gestione-utenti/gestione-utenti.component';
import { GestioneProdottiComponent } from './views/gestione-prodotti/gestione-prodotti.component';
import { InvioNotificheComponent } from './views/invio-notifiche/invio-notifiche.component';
import { ListiniPrezzoComponent } from './views/listini-prezzo/listini-prezzo.component';
import { NuovoUtenteComponent } from './views/nuovo-utente/nuovo-utente.component';
import { ModalConfigComponent } from '@Src/app/shared/modal/modal-config/modal-config.component';
import { GraficoTortaComponent } from './components/grafici/grafico-torta/grafico-torta.component';
import { NgxEchartsModule } from 'ngx-echarts';
import { PieDialogComponent } from './components/grafici/dialogs/pie-dialog/pie-dialog.component';

import { TipologiaBigliettoComponent } from './views/tipologia-biglietto/tipologia-biglietto.component';
import { GestioneClientiComponent } from './views/gestione-clienti/gestione-clienti.component';
import { NuovoClienteComponent } from './views/nuovo-cliente/nuovo-cliente.component';
import { GestioneMacrosettoriComponent } from './views/gestione-macrosettori/gestione-macrosettori.component';
import { CercaListinoComponent } from './views/listini-prezzo/cerca-listino/cerca-listino.component';
import { GeneraListinoComponent } from './views/listini-prezzo/genera-listino/genera-listino.component';

import { GestioneBigliettiComponent } from './components/gestione-biglietti/gestione-biglietti.component';
import { AggiungiBigliettiComponent } from './components/aggiungi-biglietti/aggiungi-biglietti.component';
import { AreaChartDialogComponent } from './components/grafici/dialogs/area-chart-dialog/area-chart-dialog.component';
import { VisualizzaChiusuraComponent } from './views/visualizza-chiusura/visualizza-chiusura.component';
import { DettaglioBigliettiDialogComponent } from './components/grafici/dialogs/dettaglio-biglietti-dialog/dettaglio-biglietti-dialog.component';
import { DettaglioBigliettiVenditaDialogComponent } from './components/grafici/dialogs/dettaglio-biglietti-vendita-dialog/dettaglio-biglietti-vendita-dialog.component';
import { DettaglioVenditoriAttiviDialogComponent } from './components/grafici/dialogs/dettaglio-venditori-attivi-dialog/dettaglio-venditori-attivi-dialog.component';
import { DettaglioOperatoriInterniAttiviDialogComponent } from './components/grafici/dialogs/dettaglio-operatori-interni-attivi-dialog/dettaglio-operatori-interni-attivi-dialog.component';
import { DettaglioBigliettiValidatiDialogComponent } from './components/grafici/dialogs/dettaglio-biglietti-validati-dialog/dettaglio-biglietti-validati-dialog.component';
import { DettaglioBigliettiVendutiToursComponent } from './components/grafici/dialogs/dettaglio-biglietti-venduti-tours/dettaglio-biglietti-venduti-tours.component';
import { DettaglioBigliettiValidatiOtaComponent } from './components/grafici/dialogs/dettaglio-biglietti-validati-ota/dettaglio-biglietti-validati-ota.component';
import { CorrezioneVenditeComponent } from './views/correzione-vendite/correzione-vendite.component';
import { CreazioneBigliettiCartaceiComponent } from './views/creazione-biglietti-cartacei/creazione-biglietti-cartacei.component';
import { AssegnazioneBigliettiCartaceiComponent } from './views/assegnazione-biglietti-cartacei/assegnazione-biglietti-cartacei.component';
import { DisponibilitaCartaceaDistributoriComponent } from './views/disponibilita-cartacea-distributori/disponibilita-cartacea-distributori.component';
import { CreazioneBigliettiBianchiComponent } from './views/creazione-biglietti-bianchi/creazione-biglietti-bianchi.component';
import { AssegnazioneBigliettiBianchiComponent } from './views/assegnazione-biglietti-bianchi/assegnazione-biglietti-bianchi.component';
import { RegistrazioneBigliettiBianchiVendutiComponent } from './views/registrazione-biglietti-bianchi-venduti/registrazione-biglietti-bianchi-venduti.component';
import { DettaglioPasseggeriComponent } from './components/grafici/dialogs/dettaglio-passeggeri/dettaglio-passeggeri.component';
import { ScaricaExcelFermateComponent } from './views/scarica-excel-fermate/scarica-excel-fermate.component';
import { DettaglioBigliettiVenditaReteComponent } from './components/grafici/dialogs/dettaglio-biglietti-vendita-rete/dettaglio-biglietti-vendita-rete.component';
import { VisualizzaStoricoDatiTurniComponent } from './views/visualizza-storico-dati-turni/visualizza-storico-dati-turni.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/amministratore/dashboard',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    pathMatch: 'full',
    component: DashboardComponent
  },
  {
    path: 'gestioneUtenti',
    pathMatch: 'full',
    component: GestioneUtentiComponent
  },
  {
    path: 'gestioneProdotti',
    pathMatch: 'full',
    component: GestioneProdottiComponent
  },
  {
    path: 'invioNotifiche',
    pathMatch: 'full',
    component: InvioNotificheComponent
  },
  {
    path: 'listiniPrezzo',
    pathMatch: 'full',
    component: ListiniPrezzoComponent
  },
  {
    path: 'gestioneFornitori',
    pathMatch: 'full',
    component: GestioneClientiComponent
  },
  {
    path: 'gestioneMacrocategorie',
    pathMatch: 'full',
    component: GestioneMacrosettoriComponent
  },
  {
    path: 'gestioneListini',
    pathMatch: 'full',
    component: GeneraListinoComponent
  }
  ,
  {
    path: 'correzioneVendite',
    pathMatch: 'full',
    component: CorrezioneVenditeComponent
  },
  {
    path: 'scaricoExcelFermate',
    pathMatch: 'full',
    component: ScaricaExcelFermateComponent
  },
  {
    path: 'creazioneBigliettiCartacei',
    pathMatch: 'full',
    component: CreazioneBigliettiCartaceiComponent
  }
  ,
  {
    path: 'assegnazioneBigliettiCartacei',
    pathMatch: 'full',
    component: AssegnazioneBigliettiCartaceiComponent
  }
  ,
  {
    path: 'disponibilitaCartaceaDistributori',
    pathMatch: 'full',
    component: DisponibilitaCartaceaDistributoriComponent
  }
  ,
  {
    path: 'creazioneBigliettiBianchi',
    pathMatch: 'full',
    component: CreazioneBigliettiBianchiComponent,
  }
  ,
  {
    path: 'assegnazioneBigliettiBianchi',
    pathMatch: 'full',
    component: AssegnazioneBigliettiBianchiComponent,
  }
  ,

  {
    path: 'registrazioneBigliettiBianchiVenduti',
    pathMatch: 'full',
    component: RegistrazioneBigliettiBianchiVendutiComponent,
  }
];

@NgModule({
  declarations: [
    DashboardComponent,
    GestioneUtentiComponent,
    GestioneProdottiComponent,
    InvioNotificheComponent,
    ListiniPrezzoComponent,
    NuovoUtenteComponent,
    GraficoTortaComponent,
    StackedAreaChartComponent,
    PieDialogComponent,
    TipologiaBigliettoComponent,
    GestioneClientiComponent,
    NuovoClienteComponent,
    GestioneMacrosettoriComponent,
    GeneraListinoComponent,
    CercaListinoComponent,
    GestioneBigliettiComponent,
    AggiungiBigliettiComponent,
    AreaChartDialogComponent,
    VisualizzaChiusuraComponent,
    DettaglioBigliettiDialogComponent,
    DettaglioBigliettiVenditaDialogComponent,
    DettaglioVenditoriAttiviDialogComponent,
    DettaglioOperatoriInterniAttiviDialogComponent,
    DettaglioBigliettiValidatiDialogComponent,
    DettaglioBigliettiVendutiToursComponent,
	  DettaglioBigliettiValidatiOtaComponent,
    DettaglioPasseggeriComponent,
    CorrezioneVenditeComponent,
    ScaricaExcelFermateComponent,
    CreazioneBigliettiCartaceiComponent,
    AssegnazioneBigliettiCartaceiComponent,
    DisponibilitaCartaceaDistributoriComponent,
    CreazioneBigliettiBianchiComponent,
    AssegnazioneBigliettiBianchiComponent,
    RegistrazioneBigliettiBianchiVendutiComponent,
    DettaglioBigliettiVenditaReteComponent,
    VisualizzaStoricoDatiTurniComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    NgxEchartsModule.forRoot({
      echarts: () => import('echarts')
    }),








    MaterialModule,
    RouterModule.forChild(routes),
    FormsModule
  ],
  exports: [RouterModule],
  entryComponents: [
    NuovoUtenteComponent,
    ModalConfigComponent,
    TipologiaBigliettoComponent,
    NuovoClienteComponent,
    VisualizzaChiusuraComponent,
    VisualizzaStoricoDatiTurniComponent
  ],
  providers: [DatePipe]
})
export class AmministratoreRoutingModule { }
