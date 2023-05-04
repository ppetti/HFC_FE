import { Injectable } from '@angular/core';
import { CanActivate, Router, CanActivateChild, CanLoad } from '@angular/router';
import { AuthService } from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuardService implements CanActivate, CanActivateChild, CanLoad {

  constructor(
    private auth: AuthService,
    private router: Router
  ) { }

  canActivate(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }

  canActivateChild(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }

  canLoad(): boolean {
    if (!this.auth.isAuthenticated()) {
      this.router.navigate(['home']);
      return false;
    }
    return true;
  }
}
