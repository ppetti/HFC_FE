import { ValidatoreNavigationService } from '@Src/app/modules/validatore/services/validatore-navigation.service';
import { Component, Inject, OnInit } from '@angular/core';
import { AmministartoreNavigationService } from '@Src/app/modules/amministratore/services/amministratore-navigation.service';
import { DistributoreApiService } from '@Src/app/modules/distributore/services/distributore-api.service';
import { DistributoreNavigationService } from '@Src/app/modules/distributore/services/distributore-navigation.service';
import { SESSION_STORAGE, WebStorageService } from 'ngx-webstorage-service';
import { AuthService } from '../../services/auth.service';
import { CoreApiService } from '../../services/core-api.service';
import { CoreNavigationService } from '../../services/core-navigation.service';

@Component({
  selector: 'app-profilo',
  templateUrl: './profilo.component.html',
  styleUrls: ['./profilo.component.scss']
})
export class ProfiloComponent implements OnInit {

  userInfo;
  distributore;

  constructor(
    @Inject(SESSION_STORAGE)
    private locStorage: WebStorageService,
    private coreService: CoreApiService,
    private distributoreService: DistributoreApiService,
    private navigationDist: DistributoreNavigationService,
    private navigationAdmin: AmministartoreNavigationService,
    private navigationOperatore: ValidatoreNavigationService,
    public authService: AuthService,
    private navigation: CoreNavigationService
  ) { }

  ngOnInit(): void {
    this.coreService.whoAmI().subscribe(
      userDetail => {
        this.userInfo = userDetail;
        if(this.userInfo.ruolo.nome_ruolo == 'Rivenditore') {
          this.distributoreService.getDistributoreById(this.userInfo.id).subscribe(
            dist => {
              this.distributore = dist;
            })
        }
      })
  }

  backToHome() {
    if(this.userInfo.ruolo.nome_ruolo == 'Amministratore') {
      this.navigationAdmin.goToDashboard();
    } 
	else if(this.userInfo.ruolo.nome_ruolo == 'Supervisore') {
      this.navigationAdmin.goToDashboard();
    }
	else if (this.userInfo.ruolo.nome_ruolo == 'Operatore interno') {
      this.navigationOperatore.goToHome();
    } 
	else {
      this.navigationDist.goToSelezionaCliente();
    }
  }

  logOut() {
    this.locStorage.remove('token');
    this.authService.aggiornaAuthStatus();
    this.navigation.goToHome();
  }

}
