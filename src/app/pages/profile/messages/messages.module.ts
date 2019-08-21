import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MessagesPage } from './messages.page';
import { SharedModule } from 'src/app/shared/shared.modue';

const routes: Routes = [
  {
    path: '',
    component: MessagesPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [MessagesPage]
})
export class MessagesPageModule {}
