import { Injectable } from "@angular/core";
import { Observable, of } from 'rxjs';
import { DistributoreApiService } from '@Src/app/modules/distributore/services/distributore-api.service';
import { catchError } from "rxjs/operators";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LoaderService } from "../loader/loader.service";

@Injectable()
export class Util {

  constructor(
    private distributoreService: DistributoreApiService,
    private _snackBar: MatSnackBar,
    private loader: LoaderService,
) {
}

  base64ToArrayBuffer(base64) {
    var binaryString = window.atob(base64);
    var binaryLen = binaryString.length;
    var bytes = new Uint8Array(binaryLen);
    for (var i = 0; i < binaryLen; i++) {
       var ascii = binaryString.charCodeAt(i);
       bytes[i] = ascii;
    }
    return bytes;
  }

  isGruppoSpeciale(id){
    return id == 'f8c035f9-275a-4f31-bb9d-10469a0bdc0a' ? true :  false;
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 15000,
    });
  }

}

