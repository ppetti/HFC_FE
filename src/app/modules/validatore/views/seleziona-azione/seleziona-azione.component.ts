import { Component, Inject, OnInit } from '@angular/core';
import { CoreApiService } from '@Src/app/core/services/core-api.service';
import { LoaderService } from '@Src/app/loader/loader.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ValidatoreApiService } from '../../services/validatore-api.service';
import { ValidatoreNavigationService } from '../../services/validatore-navigation.service';

@Component({
  selector: 'app-seleziona-azione',
  templateUrl: './seleziona-azione.component.html',
  styleUrls: ['./seleziona-azione.component.scss']
})
export class SelezionaAzioneComponent implements OnInit {

  userInfo: any;
  fermateList;
  fermataSelezionata;

  constructor(
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    private coreService: CoreApiService,
    private navigation: ValidatoreNavigationService,
    private validatoreService: ValidatoreApiService,
    private loader: LoaderService,
  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.coreService.whoAmI().subscribe(
      userDetail => {
        this.userInfo = userDetail
        this.loader.hide();
        })

    this.validatoreService.getAllFermate().subscribe(fermate => {
      this.fermateList = fermate;
    })
  }

  test(e) {
    console.log("test", e);
  }

  navigateToBiglietti() {
    this.navigation.goToSelezionaCliente();
  }

  goToScan() {
    this.navigation.goToScanner();
  }

}
