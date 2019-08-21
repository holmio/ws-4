import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { CreatePage } from './create.page';
import { SharedModule } from 'src/app/shared/shared.modue';

const routes: Routes = [
  {
    path: '',
    component: CreatePage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [CreatePage]
})
export class CreatePageModule {}
