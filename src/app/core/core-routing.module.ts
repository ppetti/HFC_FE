import { AmministratoreModule } from './../modules/amministratore/amministratore.module';
import { MaterialModule } from './../shared/material.module';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { HomeComponent } from './views/home/home.component';
import { LoginDialogComponent } from './views/login/login.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthGuardService as AuthGuard } from './services/auth-guard.service';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CambiaPasswordComponent } from './views/cambia-password/cambia-password.component';
import { ProfiloComponent } from './views/profilo/profilo.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/home',
    pathMatch: 'full'
  },

  {
    path: 'home',
    pathMatch: 'full',
    component: HomeComponent
  },

  {
    path: 'utente/cambiaPassword',
    pathMatch: 'full',
    component: CambiaPasswordComponent
  },

  {
    path: 'utente/profilo',
    pathMatch: 'full',
    component: ProfiloComponent,
    canActivate: [AuthGuard]
  },

  {
    path: 'rivenditore',
    loadChildren: () => import('../modules/distributore/distributore-routing.module').then(mod => mod.DistributoreRoutingModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'amministratore',
    loadChildren: () => import('../modules/amministratore/amministratore-routing.module').then(mod => mod.AmministratoreRoutingModule),
    canActivate: [AuthGuard]
  },

  {
    path: 'operatoreInterno',
    loadChildren: () => import('../modules/validatore/validatore-routing.module').then(mod => mod.ValidatoreRoutingModule),
    canActivate: [AuthGuard]
  },
];

@NgModule({
  declarations: [
    HomeComponent,
    LoginDialogComponent,
    CambiaPasswordComponent,
    ProfiloComponent
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules
    })
  ],
  exports: [RouterModule],
  entryComponents: [LoginDialogComponent]
})
export class CoreRoutingModule { }
