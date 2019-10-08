import { ResetPasswordPage } from './reset-password.page';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SharedModule } from 'src/app/shared/shared.modue';

const routes: Routes = [
  {
    path: '',
    component: ResetPasswordPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [ResetPasswordPage]
})
export class ResetPasswordPageModule {}
