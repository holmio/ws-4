import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCardComponent } from './product-card.component';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    IonicModule,
    RouterModule,
    CommonModule,
    TranslateModule.forChild(),
  ],
  declarations: [ ProductCardComponent ],
  exports: [ ProductCardComponent ],
})
export class ProductCardModule {}
