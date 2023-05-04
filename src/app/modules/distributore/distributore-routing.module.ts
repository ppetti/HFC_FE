import { CarrelloDisComponent } from './views/carrello-dis/carrello-dis.component';
import { SharedModule } from './../../shared/shared.module';
import { BigliettiDisComponent } from './views/biglietti-dis/biglietti-dis.component';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '@Src/app/shared/material.module';
import { RiepilogoDisComponent } from './views/riepilogo-dis/riepilogo-dis.component';
import { SelezioneClienteDisComponent } from './views/selezione-cliente-dis/selezione-cliente-dis.component';
import { SelezionaMacrosettoreDisComponent } from './views/seleziona-macrosettore-dis/seleziona-macrosettore-dis.component';
import { ChiusuraGiornalieraDisComponent } from './views/chiusura-giornaliera-dis/chiusura-giornaliera-dis.component';
import { StampaBigliettiDisComponent } from './views/stampa-biglietti-dis/stampa-biglietti-dis.component';
import { SaldoCreditoDisComponent } from './views/saldo-credito-dis/saldo-credito-dis.component';
import { AggiungiBigliettoDisComponent } from './views/aggiungi-biglietto-dis/aggiungi-biglietto-dis.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/rivenditore/selezioneCliente',
    pathMatch: 'full'
  },
  {
    path: 'biglietti',
    pathMatch: 'full',
    component: BigliettiDisComponent
  },
  {
    path: 'carrello',
    pathMatch: 'full',
    component: CarrelloDisComponent
  },
  {
    path: 'riepilogo',
    pathMatch: 'full',
    component: RiepilogoDisComponent
  },
  {
    path: 'selezioneCliente',
    pathMatch: 'full',
    component: SelezioneClienteDisComponent
  },
  {
    path: 'selezionaMacrosettore',
    pathMatch: 'full',
    component: SelezionaMacrosettoreDisComponent
  },
  {
    path: 'saldaCredito',
    pathMatch: 'full',
    component: SaldoCreditoDisComponent,
  },
  {
    path: 'chiusuraGiornaliera',
    pathMatch: 'full',
    component: ChiusuraGiornalieraDisComponent
  },
  {
    path: 'stampaBiglietti',
    pathMatch: 'full',
    component: StampaBigliettiDisComponent
  }

];

@NgModule({
  declarations: [
    BigliettiDisComponent,
    CarrelloDisComponent,
    RiepilogoDisComponent,
    SelezioneClienteDisComponent,
    SelezionaMacrosettoreDisComponent,
    ChiusuraGiornalieraDisComponent,
    StampaBigliettiDisComponent,
    AggiungiBigliettoDisComponent,
  ],
  imports: [
  CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes)
  ],
  exports: [RouterModule],
  entryComponents: [
    AggiungiBigliettoDisComponent,
  ]
})
export class DistributoreRoutingModule { }
