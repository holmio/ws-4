import { UserState } from './user.state';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgxsModule } from '@ngxs/store';


@NgModule({
  imports: [
    AngularFireAuthModule,
    NgxsModule.forFeature([
      UserState,
    ]),
  ],
})
export class UserModule {}
