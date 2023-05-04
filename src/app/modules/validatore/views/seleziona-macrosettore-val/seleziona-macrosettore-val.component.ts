import { CoreApiService } from '@Src/app/core/services/core-api.service';
import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '@Src/app/loader/loader.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ValidatoreApiService } from '../../services/validatore-api.service';
import { ValidatoreNavigationService } from '../../services/validatore-navigation.service';

@Component({
  selector: 'app-seleziona-macrosettore-val',
  templateUrl: './seleziona-macrosettore-val.component.html',
  styleUrls: ['./seleziona-macrosettore-val.component.scss']
})
export class SelezionaMacrosettoreValComponent implements OnInit {

  idCliente;
  listaMacrosettori;
  userInfo;
  constructor(
    private route: ActivatedRoute,
    private validatoreService: ValidatoreApiService,
    private navigation: ValidatoreNavigationService,
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    private loader: LoaderService,
    private coreService: CoreApiService

  ) { }

  ngOnInit(): void {

    this.coreService.whoAmI().subscribe(
      userDetail => {
        this.userInfo = userDetail;
        console.log("USER INFO: ", this.userInfo);
      }
    )

    this.route.queryParams.subscribe(
      params => {
        this.loader.show();
        this.idCliente = params['id']?params['id']:null;
        this.validatoreService.getMacrosettori(this.idCliente).subscribe(
          macrosettori=> {
            if(this.userInfo && this.userInfo.onlyOpenBus) {
              this.listaMacrosettori = macrosettori.filter( x => x.nome === "TICKETSTATION" || x.nome === "TICKET STATION" );
            } else {
              this.listaMacrosettori = macrosettori.filter(x => x.nome !== "TICKETSTATION" && x.nome !== "TICKET STATION");
            }
            this.loader.hide();
          }
        )
      }
    )
  }
  selezionaMacrosettore(id) {
    //salvo in sessione l'id;
    this.locStorage.set('idMacrosettore',id)
    this.navigation.goToBiglietti();
  }

  backToSelezioneCliente() {
    // this.navigation.goToSelezionaCliente(); QUESTA NAVIGAZIONE SERVIRA' IN HFC
    this.navigation.goToHome();
  }
}
