import { Component, Inject, OnInit } from '@angular/core';
import { LoaderService } from '@Src/app/loader/loader.service';
import { SESSION_STORAGE, StorageService } from 'ngx-webstorage-service';
import { ValidatoreApiService } from '../../services/validatore-api.service';
import { ValidatoreNavigationService } from '../../services/validatore-navigation.service';

@Component({
  selector: 'app-selezione-cliente-val',
  templateUrl: './selezione-cliente-val.component.html',
  styleUrls: ['./selezione-cliente-val.component.scss']
})
export class SelezioneClienteValComponent implements OnInit {

  allClienti;
  listaMacrosettori;

  constructor(
    private validatoreService: ValidatoreApiService,
    private navigation: ValidatoreNavigationService,
    @Inject(SESSION_STORAGE)
    private locStorage: StorageService,
    private loader: LoaderService,
    ) { }

  ngOnInit(): void {
    this.loader.show();
    this.locStorage.remove('idMacrosettore');
    this.validatoreService.getClienti().subscribe(
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

  goToHome() {
    this.navigation.goToHome();
  }
}
