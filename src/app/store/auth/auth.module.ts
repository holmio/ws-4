import { AuthGuard } from './auth.guard';
import { AuthState } from './auth.state';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgxsModule } from '@ngxs/store';


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
