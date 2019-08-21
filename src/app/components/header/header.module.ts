import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import {HeaderComponent} from './header.component';

@NgModule({
  imports: [
    IonicModule,
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [ HeaderComponent ],
  exports: [ HeaderComponent ],
})
export class HeaderModule {}
