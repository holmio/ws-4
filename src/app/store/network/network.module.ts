import { NetworkState } from './network.state';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgxsModule } from '@ngxs/store';


@NgModule({
  imports: [
    AngularFireAuthModule,
    NgxsModule.forFeature([
      NetworkState,
    ]),
  ]
})
export class NetworkModule {}
