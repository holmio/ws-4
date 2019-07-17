import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { ProductState } from './product.state';

@NgModule({
  imports: [
    AngularFireAuthModule,
    NgxsModule.forFeature([
      ProductState,
    ]),
  ],
})
export class ProductsModule {
}
