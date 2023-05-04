import { CoreApiService } from './core/services/core-api.service';
import { CoreNavigationService } from './core/services/core-navigation.service';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MENU_LIST_ITEMS_ADMIN, MENU_LIST_ITEMS_DIST, MENU_LIST_ITEMS_NOAUTH, MENU_LIST_ITEMS_VALID, MENU_LIST_ITEMS_DIST_NON_ABITUALE, MENU_LIST_ITEMS_SUPERVISORE } from './core/menuItems';
import { AuthService } from './core/services/auth.service';
import { LoginDialogComponent } from './core/views/login/login.component';
import jwt_decode from 'jwt-decode';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { LoaderService } from './loader/loader.service';
import { DistributoreApiService } from './modules/distributore/services/distributore-api.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'HFC-FE';

  isAuth: boolean;
  tokenInfo;
  userInfo;
  menuItems;
  distributore;

  loading$ = this.loaderService.loading$;

  constructor(
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    public dialog: MatDialog,
    public authService: AuthService,
    private coreService: CoreApiService,
    private navigation: CoreNavigationService,
    public loaderService: LoaderService,
    private distributoreService: DistributoreApiService
    ) {
    authService.getAuthStatus().subscribe(
      authStatus => {
        this.isAuth = authStatus;
        if (this.locStorage.get('token')){
          const decodedToken: any = jwt_decode(this.locStorage.get('token'));
          this.tokenInfo = decodedToken;
          coreService.whoAmI().subscribe(
            userDetail => {
              this.userInfo = userDetail;
              console.log('AppComponent -> this.userInfo', this.userInfo)
              if(this.userInfo.ruolo.nome_ruolo == 'Rivenditore') {
                this.distributoreService.getDistributoreById(this.userInfo.id).subscribe(
                  dist => {
                    this.distributore = dist;
                    this.impostaMenu(decodedToken.ruolo);
                  })
              } else {
                this.impostaMenu(decodedToken.ruolo);
              }
            }
          );
          // switch(decodedToken.ruolo) {
          //   case 'Rivenditore': this.menuItems = this.distributore?.abituale ? MENU_LIST_ITEMS_DIST() : MENU_LIST_ITEMS_DIST_NON_ABITUALE(); break;
          //   case 'Operatore interno': this.menuItems = MENU_LIST_ITEMS_VALID(); break;
          //   case 'Amministratore': this.menuItems = MENU_LIST_ITEMS_ADMIN(); break;
          //   default: this.menuItems = MENU_LIST_ITEMS_NOAUTH();
          // }
        }
      }
    );
  }

  impostaMenu(ruolo){
    switch(ruolo) {
      case 'Rivenditore': this.menuItems = this.distributore?.abituale ? MENU_LIST_ITEMS_DIST() : MENU_LIST_ITEMS_DIST_NON_ABITUALE(); break;
      //case 'Rivenditore': this.menuItems = MENU_LIST_ITEMS_DIST(); break;
      case 'Operatore interno': this.menuItems = MENU_LIST_ITEMS_VALID(); break;
      case 'Amministratore': this.menuItems = MENU_LIST_ITEMS_ADMIN(); break;
	  case 'Supervisore': this.menuItems = MENU_LIST_ITEMS_SUPERVISORE(); break;
      default: this.menuItems = MENU_LIST_ITEMS_NOAUTH();
    }
  }

  ngOnInit(): void {
    this.authService.aggiornaAuthStatus();
  }

  openAccedi(): void {
    this.dialog.open(LoginDialogComponent,
      {
        disableClose: true
      });
  }

  logOut(): void {
    this.locStorage.remove('token');
    this.authService.aggiornaAuthStatus();
    this.navigation.goToHome();
  }

  goToProfilo(): void {
    this.navigation.goToProfilo();
  }


}
