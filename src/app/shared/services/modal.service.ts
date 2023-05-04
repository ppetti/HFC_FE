import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ModalConfigComponent } from '../modal/modal-config/modal-config.component';

@Injectable({
  providedIn: 'root'
})
export class ModalService {

  constructor(private dialog: MatDialog) { }

  openModal(title, msg) {
    return this.dialog.open(ModalConfigComponent,{
      width: '370px',
      panelClass: 'confirm-dialog-container',
      disableClose: true,
      position: {top: "30vh"},
      data:{
        header: title,
        testo: msg
      }
    });
  }
}
