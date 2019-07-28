import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailPage } from './detail.page';
import { SharedModule } from 'src/app/shared/shared.modue';
import { ProductCardModule } from 'src/app/components/product-card/product-card.module';

const routes: Routes = [
  {
    path: '',
    component: DetailPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    ProductCardModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailPage]
})
export class DetailPageModule {}
