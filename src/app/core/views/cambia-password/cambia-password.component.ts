import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective, NgForm, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute } from '@angular/router';
import { DistributoreApiService } from '@Src/app/modules/distributore/services/distributore-api.service';
import { DistributoreNavigationService } from '@Src/app/modules/distributore/services/distributore-navigation.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { CoreApiService } from '../../services/core-api.service';
import jwt_decode from 'jwt-decode';
import { CoreNavigationService } from '../../services/core-navigation.service';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const invalidCtrl = !!(control && control.invalid && control.parent.dirty);
    const invalidParent = !!(control && control.parent && control.parent.invalid && control.parent.dirty);

    return (invalidCtrl || invalidParent);
  }
}

@Component({
  selector: 'app-cambia-password',
  templateUrl: './cambia-password.component.html',
  styleUrls: ['./cambia-password.component.scss']
})
export class CambiaPasswordComponent implements OnInit {

  hidePassword = true;
  hideConfirmPassword = true;
  username;
  passwordForm: FormGroup;
  userInfo
  matcher = new MyErrorStateMatcher();

  constructor(
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    private route: ActivatedRoute,
    private coreService: CoreApiService,
    private fb: FormBuilder,
    private navigation: CoreNavigationService,
    private _snackBar: MatSnackBar
  ) { }

  ngOnInit(): void {
    // this.route.queryParams.subscribe(
    //   params => {
    //     this.username = params['username']?params['username']:null;
    //   }
    // )
    this.coreService.whoAmI().subscribe(
      userDetail => {
        this.userInfo = userDetail;
        this.username = userDetail.login;
      }
    )
    this.passwordForm = this.fb.group({
      password:['', Validators.compose([Validators.required, Validators.pattern("^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$")])],
      confermaPassword:['', Validators.required]
    },
    {validator: this.checkPasswords});
  }


  cambiaPassword() {
    this.coreService.cambiaPassword(this.username, this.passwordForm.controls.password.value).subscribe(
      res => {
        this.openSnackBar(res.messaggio, 'chiudi');
        let token = this.locStorage.get('token');
        const decodedToken: any = jwt_decode(token);
        if(decodedToken.ruolo == 'Rivenditore'){
          this.navigation.goToSceltaCliente();
        } else {
          this.navigation.goToSelezionaFunzione();
        }
      }
    )
  }

  checkPasswords(group: FormGroup) {
    let pass = group.controls.password.value;
    let confermaPassword = group.controls.confermaPassword.value;

    return pass === confermaPassword ? null : { notSame: true }
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 3000,
    });
  }

}
