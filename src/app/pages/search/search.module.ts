import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { SearchPage } from './search.page';
import { SharedModule } from 'src/app/shared/shared.modue';

const routes: Routes = [
  {
    path: '',
    component: SearchPage
  }
];

@NgModule({
  imports: [
    SharedModule,
    RouterModule.forChild(routes)
  ],
  declarations: [SearchPage]
})
export class SearchPageModule {}
