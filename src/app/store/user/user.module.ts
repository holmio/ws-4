import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AngularFireAuthModule } from '@angular/fire/auth';
import { UserState } from './user.state';

@NgModule({
  imports: [
    AngularFireAuthModule,
    NgxsModule.forFeature([
      UserState,
    ]),
  ],
})
export class UserModule {}