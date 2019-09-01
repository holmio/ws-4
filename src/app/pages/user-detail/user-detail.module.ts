import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';


import { UserDetailPage } from './user-detail.page';
import { SharedModule } from 'src/app/shared/shared.modue';

const routes: Routes = [
  {
    path: '',
    component: UserDetailPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [UserDetailPage]
})
export class UserDetailPageModule {}
