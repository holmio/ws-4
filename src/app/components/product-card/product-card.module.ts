import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { ProductCardComponent } from './product-card.component';
import { SharedModule } from 'src/app/shared/shared.modue';

@NgModule({
  imports: [
    SharedModule,
    TranslateModule.forChild(),
  ],
  declarations: [ ProductCardComponent ],
  exports: [ ProductCardComponent ],
})
export class ProductCardModule {}
