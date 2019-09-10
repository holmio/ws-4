import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import {
  Actions,
  ofActionSuccessful,
  Select,
  Store
  } from '@ngxs/store';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { filter, take } from 'rxjs/operators';
import {
  Product,
  ProductState,
  UpdateProductAction,
  UpdateProductSuccessAction
  } from 'src/app/store/product';
import { APP_CONST } from 'src/app/util/app.constants';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, OnDestroy {

  @Select(ProductState.loading) loading$: Observable<boolean>;
  @Select(ProductState.getProduct) product$: Observable<Product>;
  myGroup: FormGroup;
  categories = _.cloneDeep(APP_CONST.categories);
  currencies = _.cloneDeep(APP_CONST.currencies);
  willayas = _.cloneDeep(APP_CONST.willayas);
  dairas = [];
  customActionSheetOptions: any = {
    header: '[T]Categorias',
    subHeader: '[T]Selecciona la categoria de tu producto',
    cssClass: '[T]category-sheet'
  };
  gallery: string[] = [];
  imagesToDelete: string[] = [];
  private destroy$ = new Subject<boolean>();

  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
    private navController: NavController,
    private actions: Actions
  ) {
  }

  ngOnInit() {

    this.product$.pipe(
      filter(data => !!data),
      take(1),
    ).subscribe(product => {
      // Filter categories
      this.categories.filter(category => {
        if (product.category.hasOwnProperty(category.value)) {
          category.selected = true;
        }
      });
      this.getDaira(product.willaya);
      this.gallery = [...product.gallery];
      this.myGroup = this.formBuilder.group({
        name: [product.name || '', Validators.required],
        price: [product.price || '', Validators.required],
        description: [product.description || '', Validators.required],
        currency: [product.currency || 'DZD', Validators.required],
        category: [product.category || '', Validators.required],
        isEnabled: [product.isEnabled || false, Validators.required],
        willaya: [product.willaya || '', Validators.required],
        daira: [{value: product.daira || '', disabled: !product.willaya}, Validators.required],
        isSold: [product.isSold || false, Validators.required],
      });
    });

    this.actions.pipe(
      ofActionSuccessful(UpdateProductSuccessAction),
      take(1)
    ).subscribe(() => {
      setTimeout(() => {
        this.navController.back();
      }, 300);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  update() {
    const finalProduct: Product = {
      ...this.getDirtyValues(this.myGroup) as any,
      gallery: [...this.gallery],
    };
    setTimeout(() => {
      this.store.dispatch(new UpdateProductAction(finalProduct, this.imagesToDelete));
    }, 100);
  }

  onChangeWillaya(event) {
    const willayaSelected = event.target.value;
    this.getDaira(willayaSelected);
    this.myGroup.controls.daira.enable();
  }

  handleImagesDeleted(image: string) {
    this.imagesToDelete.push(image);
  }

  handleGallery(images: string[]) {
    this.gallery = images;
  }

  private getDaira(willaya: string) {
    if (!willaya) {
      return;
    }
    this.dairas = [];
    this.dairas = [..._.find(this.willayas, {value: willaya}).dairas];
  }

  private getDirtyValues(form: any) {
    const dirtyValues = {};

    Object.keys(form.controls)
      .forEach(key => {
        const currentControl = form.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls) {
            dirtyValues[key] = this.getDirtyValues(currentControl);
          } else {
            dirtyValues[key] = currentControl.value;
          }
        }
      });

    return dirtyValues;
  }

}
