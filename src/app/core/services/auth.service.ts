import { Injectable, Inject } from '@angular/core';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { Subject, Observable } from 'rxjs';
import jwt_decode from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authStatus = new Subject<boolean>();

  constructor(
    @Inject(SESSION_STORAGE)
    private locStorage: WebStorageService
  ) { }


  aggiornaAuthStatus(): void {
    const token = this.locStorage.get('token');
    token
      ? this.authStatus.next(true)
      : this.authStatus.next(false);
  }

  // Controlla semplicemente se il token esiste
  public isAuthenticated(): boolean {
    console.log('IsAUTH??? ');
    // return true;
    const token = this.locStorage.get('token');
    return token ? true : false;
  }

  getAuthStatus(): Observable<any> {
    return this.authStatus.asObservable();
  }

  getAuthUser(): any {
    return JSON.parse(atob(this.locStorage.get('token').token));
  }

  public isAdmin(): boolean {
    const user = JSON.parse(atob(this.locStorage.get('token').token));
    return user.Roles.findIndex(x => x === 'Amministratore') !== -1;
  }
  public isSupervisore(): boolean {
    let token = this.locStorage.get('token');
    const decodedToken: any = jwt_decode(token);
    return decodedToken.ruolo == 'Supervisore';
  }
}
