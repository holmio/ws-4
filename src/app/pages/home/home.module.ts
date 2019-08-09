import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { SharedModule } from 'src/app/shared/shared.modue';
import { ProductCardModule } from 'src/app/components/product-card/product-card.module';

@NgModule({
  imports: [
    ProductCardModule,
    SharedModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage],
})
export class HomePageModule {}
