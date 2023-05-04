import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { CrudService } from './crud.service';

@Injectable({
  providedIn: 'root'
})
export class CoreApiService {

  constructor(private crudService: CrudService) {
  }

  public login(username, password): Observable<any> {
    console.log('INSIDE LOGIN');
    const credentials = { username, password };
    return this.crudService.save(`authenticate`, credentials);
    // return this.crudService.selectAll('amministratori');
  }

  public whoAmI(): Observable<any> {
    return this.crudService.selectAll('whoAmI');
  }

  public cambiaPassword(username, nuovaPassword): Observable<any> {
    const newPwd = {'pwd': nuovaPassword}
    return this.crudService.modifyWithoutID(`utenti/${username}/cambiaPassword`, newPwd);
  }

}
