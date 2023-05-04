import { Injectable, Inject } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { environment } from '@Src/environments/environment';
import { Observable, throwError, of } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { ActivatedRoute, Router, RouterState } from '@angular/router';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { LoaderService } from './../loader/loader.service';

@Injectable({
  providedIn: 'root'
})
export class ApiPrefixerInterceptor implements HttpInterceptor {

  databaseName: any = '';
  authToken: string;
  newHeaders: HttpHeaders;
  newParams;
  currentType;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private loader: LoaderService,
    @Inject(SESSION_STORAGE)
      private locStorage: WebStorageService
  ) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<any> {
    console.log('Intercepted');
    const state: RouterState = this.router.routerState;
    this.newHeaders = request.headers;
    const hasToken = this.locStorage.get('token');
    this.authToken = `Bearer ${this.locStorage.get('token')}`;
    hasToken
      ? this.newHeaders = this.newHeaders.set('Authorization', this.authToken)
      : this.newHeaders = this.newHeaders;
    if (request.url.includes('http:') || request.url.includes('/assets/') ) {
      return next.handle(request);
    }
    return next.handle(request.clone({
      headers: this.newHeaders.set('rejectUnauthorized', 'false'),
      url: (environment.settings.backendUrl) + request.url
    }))
    // .pipe(
    //   catchError(error => {
    //     this.loader.hide();
    //     console.log('ERRORE INTERCETTATO', error);
    //     if (error.status === 401) {
    //     } else if (error.status === 400 || error.status === 500 || error.status === 404 || error.status === 403) {
    //         console.warn('error', error);
    //     }
    //     return of([]);
    //   })
    // );

  }

}
