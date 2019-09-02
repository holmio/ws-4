import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { SearchState } from './search.state';

@NgModule({
  imports: [
    AngularFireAuthModule,
    NgxsModule.forFeature([
      SearchState,
    ]),
  ],
})
export class SearchModule {
}
