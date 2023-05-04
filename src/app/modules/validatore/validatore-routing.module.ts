import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '@Src/app/shared/shared.module';
import { MaterialModule } from '@Src/app/shared/material.module';
import { RouterModule, Routes } from '@angular/router';
import { BigliettiValComponent } from './views/biglietti-val/biglietti-val.component';
import { CarrelloValComponent } from './views/carrello-val/carrello-val.component';
import { ChiusuraGiornalieraValComponent } from './views/chiusura-giornaliera-val/chiusura-giornaliera-val.component';
import { RiepilogoValComponent } from './views/riepilogo-val/riepilogo-val.component';
import { SelezionaMacrosettoreValComponent } from './views/seleziona-macrosettore-val/seleziona-macrosettore-val.component';
import { SelezioneClienteValComponent } from './views/selezione-cliente-val/selezione-cliente-val.component';
import { StampaBigliettiValComponent } from './views/stampa-biglietti-val/stampa-biglietti-val.component';
import { SelezionaAzioneComponent } from './views/seleziona-azione/seleziona-azione.component';
import { ScannerComponent } from './views/scanner/scanner.component';
import { ZXingScannerModule } from '@zxing/ngx-scanner';
import { RiepilogoScannerComponent } from './views/riepilogo-scanner/riepilogo-scanner.component';
import { AggiungiBigliettoValComponent } from './views/aggiungi-biglietto-val/aggiungi-biglietto-val.component';
import { DatiGiornataComponent } from './views/dati-giornata/dati-giornata.component';


const routes: Routes = [
  {
    path: '',
    redirectTo: '/operatoreInterno/selezionaFunzione',
    pathMatch: 'full'
  },
  {
    path: 'selezionaFunzione',
    pathMatch: 'full',
    component: SelezionaAzioneComponent
  },
  {
    path: 'biglietti',
    pathMatch: 'full',
    component: BigliettiValComponent
  },
  {
    path: 'carrello',
    pathMatch: 'full',
    component: CarrelloValComponent
  },
  {
    path: 'riepilogo',
    pathMatch: 'full',
    component: RiepilogoValComponent
  },
  {
    path: 'selezioneCliente',
    pathMatch: 'full',
    component: SelezioneClienteValComponent
  },
  {
    path: 'selezionaMacrosettore',
    pathMatch: 'full',
    component: SelezionaMacrosettoreValComponent
  },
  {
    path: 'chiusuraGiornaliera',
    pathMatch: 'full',
    component: ChiusuraGiornalieraValComponent
  },
  {
    path: 'stampaBiglietti',
    pathMatch: 'full',
    component: StampaBigliettiValComponent
  },
  {
    path: 'scanner',
    pathMatch: 'full',
    component: ScannerComponent
  },
  {
    path: 'riepilogoScanner',
    pathMatch: 'full',
    component: RiepilogoScannerComponent
  },
  {
    path: 'datiGiornarta',
    pathMatch: 'full',
    component: DatiGiornataComponent,
  }
]

@NgModule({
  declarations: [
    BigliettiValComponent,
    CarrelloValComponent,
    ChiusuraGiornalieraValComponent,
    RiepilogoValComponent,
    SelezionaMacrosettoreValComponent,
    SelezioneClienteValComponent,
    StampaBigliettiValComponent,
    SelezionaAzioneComponent,
    ScannerComponent,
    RiepilogoScannerComponent,
    AggiungiBigliettoValComponent,
    DatiGiornataComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    SharedModule,
    MaterialModule,
    RouterModule.forChild(routes),
    ZXingScannerModule
  ],
  exports: [RouterModule]
})
export class ValidatoreRoutingModule { }
