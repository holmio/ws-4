import { NgModule } from '@angular/core';
import { NgxsModule } from '@ngxs/store';

import { AuthState } from './auth.state';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { AuthGuard } from './auth.guard';

@NgModule({
  imports: [
    AngularFireAuthModule,
    NgxsModule.forFeature([
      AuthState,
    ]),
  ],
  providers: [
    AuthGuard
  ]
})
export class AuthModule {}