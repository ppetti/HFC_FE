import { CoreRoutingModule } from './core/core-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { NgModule, LOCALE_ID } from '@angular/core';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppRoutingModule } from './app-routing.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { ApiPrefixerInterceptor } from './interceptors/api-prefixer.interceptor';
import { MaterialModule } from './shared/material.module';
import { registerLocaleData } from '@angular/common';
import localeIt from '@angular/common/locales/it';
registerLocaleData(localeIt);
import { InterceptorService } from './loader/interceptor.service';
import { SaldoCreditoDisComponent } from './modules/distributore/views/saldo-credito-dis/saldo-credito-dis.component';
import { StripeModule } from "stripe-angular"

@NgModule({
  declarations: [
    AppComponent,
    SaldoCreditoDisComponent,
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    CoreRoutingModule,
    StripeModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ApiPrefixerInterceptor,
      multi: true
    },
    { provide: HTTP_INTERCEPTORS, useClass: InterceptorService, multi: true },
    { provide: LOCALE_ID, useValue: 'it-IT' },
    CookieService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
