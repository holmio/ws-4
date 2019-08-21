import { NgModule } from '@angular/core';
import { ProductCardComponent } from './product-card.component';
import { SharedModule } from 'src/app/shared/shared.modue';

@NgModule({
  imports: [
    SharedModule,
  ],
  declarations: [ ProductCardComponent ],
  exports: [ ProductCardComponent ],
})
export class ProductCardModule {}
