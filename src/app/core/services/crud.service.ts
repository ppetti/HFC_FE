import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class CrudService {

    static router: Router;

    public stuff: Stuff = new Stuff();

    constructor(
        private httpClient: HttpClient,
        // private spinnerService: SpinnerService
                ) {

    }

    /**
     * chiama la il servizio indicato nel param 'method'
     * @param {string} method
     */
    public selectAll(method: string): Observable<any> {
        // this.spinnerService.showSpinner();
        return this.httpClient.get(method).pipe(
            map(res => {
                // this.spinnerService.hideSpinner();
                // let response = new Response();
                // response.deserialize(res);
                return res;
            }),
            catchError(
                err => {
                    // this.spinnerService.hideSpinner();
                    return "Errore durante selectAll";
                }
            )
        );
    }

    public selectOneAsByteArray(method,id): Observable<any> {
        return this.httpClient.get(`${method}/${id}`, {responseType: "arraybuffer"} ).pipe(
            map(
                res => res
            ),
            catchError(
                err => {
                    return "Errore durante selectOne"
                }
            )
        );
    }

    public selectOne(method, id): Observable<any> {
        return this.httpClient.get(`${method}/${id}`).pipe(
            map(
                res => res
            ),
            catchError(
                err => {
                    return "Errore durante selectOne"
                }
            )
        );
    }

    public modify(method: string, id, model: any): Observable<any> {
        console.warn('method  ', method);
        console.warn('model ', model);

        return this.httpClient.put(`${method}/${id}`, model).pipe(
            map(res => {
                return res;
            }),
            catchError(err => {
                return err;
            })
        );
    }

    public modifyWithoutID(method: string, model: any): Observable<any> {
      console.warn('method  ', method);
      console.warn('model ', model);

      return this.httpClient.put(`${method}`, model).pipe(
          map(res => {
              return res;
          }),
          catchError(err => {
              return err;
          })
      );
  }

  public modifyWithoutIDWithParams(method: string, model: any, param: any): Observable<any> {
    console.warn('method  ', method);
    console.warn('model ', model);

    return this.httpClient.put(`${method}`, model, {
      params: param
    }).pipe(
      map(res => {
        return res;
      }),
      catchError(err => {
        return err;
      })
    );
  }

    /**
     * chiama la il servizio indicato nel param 'method' ed aggiunge i param 'param' in coda all'url
     * @param {string} method
     */
    public selectAllWithParams(method: string, param: any): Observable<any> {
        return this.httpClient.get(method, {
          params: param
        }).pipe(
            map(res => {
                return res;
            }),
        );
    }

    /**
     * metodo che ritorna files Json conservati in ./assets/json
     * @param {string} path
     */
    protected selectAllLocal(path: string): Observable<any> {
        return this.httpClient.get('./assets/json/' + path).pipe(
            map(res => {
                return res;
            })
        );
    }

    /**
     * chiama la il servizio in 'POST' indicato nel param 'method' e passa il 'model' da persistere
     * @param {string} method
     * @param {any} model
     */
    public save(method: string, model: any): Observable<any> {
        console.warn('method  ', method);
        console.warn('model ', model);

        return this.httpClient.post(method, model).pipe(
            map(res => {
                return res;
            }),
            catchError(err => {
                return throwError(err);
            })
        );
    }

    /**
     * chiama la il servizio in 'DELETE' indicato nel param 'method' e passa l' 'id' dell'oggetto da eliminare
     * @param {string} method
     * @param {string} id
     */
    public delete(method: string, id: string): Observable<any> {
        return this.httpClient.delete(`${method}/${id}`).pipe(
            map(res => {
                return res;
            }),
            // catchError(err => {
            //     return throwError(err);
            // })
        );
    }

  public deleteAll(method: string): Observable<any> {
    return this.httpClient.delete(`${method}`).pipe(
      map(res => {
        return res;
      })
    );
  }

  public deleteWithParams(method: string, id: any, param: any): Observable<any> {
    return this.httpClient.delete(`${method}/${id}`, {params: param}).pipe(
      map(res => {
        return res;
      })
    );
  }
}

/////////////////////////////////////////////////////////////////////
//                   AUXILIARY CASS
/////////////////////////////////////////////////////////////////////

export class CrudServiceOptions {



    constructor() {
    }

    /**
     * viene richiamato in caso di errore in risposta sulle chiamate, in base al tipo di errore
     * si occupa di gestire l'azione da intraprendere
     */
    static handleError(error: any) {
        // In a real world app, we might use a remote logging infrastructure
        // We'd also dig deeper into the error to get a better message
        // if (error.message === 'The incoming token has expired') {
        //     this.routerService.navigate(['auth/login']);
        // }

        if (error.status === 401) {
            // this.routerService.navigate(['']);
        }

        // this.routerService.navigate(['auth/login']);

        const errMsg = (error.message) ? error.message : 'Generic error';

            error.status ? `${error.status} - ${error.statusText}` : 'Server error';
        throw throwError(errMsg);
    }
}

export class Stuff {
    public accessToken: string;
    public idToken: string;
}
