import { CoreNavigationService } from '../../services/core-navigation.service';
import { AuthService } from './../../services/auth.service';
import { CoreApiService } from './../../services/core-api.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { LoginModel } from '../../models/login.model';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { CookieService } from 'ngx-cookie-service';
import { SESSION_STORAGE, StorageService, StorageTranscoders } from 'ngx-webstorage-service';
import jwt_decode from 'jwt-decode';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginDialogComponent implements OnInit {
  loginModel: LoginModel = new LoginModel();
  loginForm: FormGroup;
  hide = true;
  ricordami: boolean;

  constructor(
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    public dialogRef: MatDialogRef<LoginDialogComponent>,
    private formBuilder: FormBuilder,
    private auth: AuthService,
    private cookie: CookieService,
    private coreService: CoreApiService,
    private navigation: CoreNavigationService,
    private _snackBar: MatSnackBar

  ) { }

  ngOnInit(): void {
    this.loginForm = this.formBuilder.group({
      username: [this.loginModel.username, [
        Validators.required
      ]],
      password: [this.loginModel.password, [
        Validators.required,
      ]]
    });
  }

  annulla(): void {
    this.dialogRef.close();
  }


  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

  login(): void {
    const credentials: LoginModel = this.loginForm.value;
    this.coreService.login(credentials.username.trim(), credentials.password.trim()).subscribe(
      res => {
        this.locStorage.set('token', res.token);
        this.auth.aggiornaAuthStatus();
        this.dialogRef.close();
        const decodedToken: any = jwt_decode(res.token);
        switch(decodedToken.ruolo) {
          case 'Amministratore': 
		  case 'Supervisore':
			this.navigation.goToDashboard(); 
			break;
          case 'Rivenditore': {
            if(decodedToken.firstAccess == false) {
              this.navigation.goToCambiaPassword(decodedToken.userName);
            } else {
              this.navigation.goToSceltaCliente();
            }
            break;
          }
          case 'Operatore interno': {
            if(decodedToken.firstAccess == false) {
              this.navigation.goToCambiaPassword(decodedToken.userName);
            } else {
              this.navigation.goToSelezionaFunzione();
            }
            break;
          }
        }
      },
      err => {
        console.log('errore', err);
        this.openSnackBar('Impossibile accedere. Credenziali errate', 'chiudi');
      }
    );
  }

  changeCheckBox(): void {}

  onRememberMe(): void {}

}
