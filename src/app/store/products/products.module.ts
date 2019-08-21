import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { ProductsState } from './products.state';

@NgModule({
  imports: [
    AngularFireAuthModule,
    NgxsModule.forFeature([
      ProductsState,
    ]),
  ],
})
export class ProductsModule {
}
