import { CommonModule } from "@angular/common";
import { NgModule, ModuleWithProviders } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { TranslateModule } from "@ngx-translate/core";
import { IonicModule } from "@ionic/angular";
import { HeaderModule } from '../components/header/header.module';
import { LazyLoadImageModule } from 'ng-lazyload-image';
import { RouterModule } from '@angular/router';
import { LoadingModule } from '../components/loading/loading.module';


@NgModule({
  declarations: [],
  entryComponents: [],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    HeaderModule,
    LazyLoadImageModule,
    RouterModule,
    LoadingModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    IonicModule,
    TranslateModule,
    ReactiveFormsModule,
    HeaderModule,
    LazyLoadImageModule,
    RouterModule,
    LoadingModule,
  ]
})
export class SharedModule {
  static forRoot(): ModuleWithProviders {
    return {
      ngModule: SharedModule
    };
  }
}
