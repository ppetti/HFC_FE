import { Location } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LoaderService } from '@Src/app/loader/loader.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DistributoreApiService } from '../../services/distributore-api.service';
import { DistributoreNavigationService } from '../../services/distributore-navigation.service';

@Component({
  selector: 'app-seleziona-macrosettore-dis',
  templateUrl: './seleziona-macrosettore-dis.component.html',
  styleUrls: ['./seleziona-macrosettore-dis.component.scss']
})
export class SelezionaMacrosettoreDisComponent implements OnInit {

  idCliente;
  listaMacrosettori = [];
  constructor(
    private route: ActivatedRoute,
    private distributoreApi: DistributoreApiService,
    private navigation: DistributoreNavigationService,
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    private loader: LoaderService,

  ) { }

  ngOnInit(): void {
    this.loader.show();
    this.route.queryParams.subscribe(
      params => {
        this.idCliente = params['id']?params['id']:null;
        this.distributoreApi.getMacrosettoriDistributore(this.idCliente).subscribe(
          macrosettori=> {
          // this.listaMacrosettori=macrosettori;
          if(macrosettori){
            macrosettori.forEach(macrosettore => {
              if(macrosettore.nome.toLowerCase() == "open bus" || macrosettore.nome.toLowerCase() == "openbus"){
                this.listaMacrosettori.push(macrosettore);
              }
            });
          }
        }
        )
        this.loader.hide();
      }
    )
  }
  selezionaMacrosettore(id) {
    //salvo in sessione l'id;
    this.locStorage.set('idMacrosettore',id)
    this.navigation.goToBiglietti();
  }

  backToSelezioneCliente() {
    this.navigation.goToSelezionaCliente();
  }
}
