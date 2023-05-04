import { Component, Inject, OnInit } from '@angular/core';
import { LoaderService } from '@Src/app/loader/loader.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { DistributoreApiService } from '../../services/distributore-api.service';
import { DistributoreNavigationService } from '../../services/distributore-navigation.service';

@Component({
  selector: 'app-selezione-cliente-dis',
  templateUrl: './selezione-cliente-dis.component.html',
  styleUrls: ['./selezione-cliente-dis.component.scss']
})
export class SelezioneClienteDisComponent implements OnInit {

  allClienti;
  listaMacrosettori;

  constructor(
    private distributoreApi: DistributoreApiService,
    private navigation: DistributoreNavigationService,
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    private loader: LoaderService,
    ) { }

  ngOnInit(): void {
    this.loader.show();
    this.locStorage.remove('idMacrosettore');
    this.distributoreApi.getClienti().subscribe(
      clienti => {
        this.allClienti = clienti;
        if(this.allClienti.length == 1) {
          this.navigation.goToSelezionaMacrosettore(this.allClienti[0].id);
          this.locStorage.set('idFornitore', this.allClienti[0].id);
        }
        this.loader.hide();
      }
    );
  }

  selezionaCliente(id) {
    this.locStorage.set('idFornitore', id)
    this.navigation.goToSelezionaMacrosettore(id);
  }
}
