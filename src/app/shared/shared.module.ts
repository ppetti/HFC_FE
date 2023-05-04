import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from './material.module';
import { ModalConfigComponent } from './modal/modal-config/modal-config.component';
import { Util } from './util';

@NgModule({
  declarations: [ModalConfigComponent],
  imports: [

  CommonModule,
    MaterialModule
  ],
  providers: [ Util
]
})
export class SharedModule { }
