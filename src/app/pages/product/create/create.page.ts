import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Actions, ofActionDispatched, Store } from '@ngxs/store';
import * as _ from 'lodash';
import { Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast/toast.services';
import { Product, SetProductAction, SetProductSuccessAction } from 'src/app/store/product';
import { APP_CONST } from 'src/app/util/app.constants';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit, OnDestroy {

  myGroup: FormGroup;
  categories = _.cloneDeep(APP_CONST.categories);
  currencies = _.cloneDeep(APP_CONST.currencies);
  willayas = _.cloneDeep(APP_CONST.willayas);
  dairas = [];
  imagesSelected = [];

  customActionSheetOptions: any = {
    header: '[T]Categorias',
    subHeader: '[T]Selecciona la categoria de tu producto',
    cssClass: '[T]category-sheet'
  };
  private destroy$ = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private toastService: ToastService,
    private actions: Actions,
    private navController: NavController,
  ) { }

  ngOnInit() {
    this.myGroup = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      willaya: ['', Validators.required],
      daira: [{ value: '', disabled: true }, Validators.required],
      currency: ['DZD', Validators.required],
      category: ['', Validators.required],
    });

    this.actions.pipe(
      ofActionDispatched(SetProductSuccessAction),
      take(1)
    ).subscribe((action) => {
      this.navController.navigateRoot('product/detail/' + action.uid);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  handleGallery(images: string[]) {
    this.imagesSelected = images;
  }

  create() {
    if (this.imagesSelected.length === 0) {
      return this.toastService.show({ message: '[T]Necesitas subir minimo una foto del producto', color: 'warning' });
    }
    const productInfo: Product = {
      gallery: [...this.imagesSelected],
      ...this.myGroup.value
    };
    this.store.dispatch(new SetProductAction(productInfo));
  }

  onChangeWillaya(willaya: string) {
    const willayaSelected = willaya;
    this.getDaira(willayaSelected);
    this.myGroup.controls.daira.enable();
  }

  private getDaira(willaya: string) {
    if (!willaya) {
      return;
    }
    this.dairas = [];
    this.dairas = [..._.find(this.willayas, { value: willaya }).dairas];
  }



}
