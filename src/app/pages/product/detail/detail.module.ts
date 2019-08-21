import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { DetailPage } from './detail.page';
import { SharedModule } from 'src/app/shared/shared.modue';
import { ModalSlidersComponent } from 'src/app/components/modal-sliders/modal-sliders.component';

const routes: Routes = [
  {
    path: '',
    component: DetailPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [DetailPage, ModalSlidersComponent],
  entryComponents: [ModalSlidersComponent]
})
export class DetailPageModule {}
