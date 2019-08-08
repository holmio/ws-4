import { Component, OnInit, OnDestroy } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ProductState, Product, UpdateProductAction } from 'src/app/store/product';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { parseCategoryList } from 'src/app/util/common';
import { CATEGORIES, CURRENCIES } from 'src/app/util/app.constants';
import * as _ from 'lodash';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, OnDestroy {

  @Select(ProductState.loading) loading$: Observable<boolean>;
  @Select(ProductState.getProduct) product$: Observable<Product>;
  myGroup: FormGroup;
  categories = _.cloneDeep(CATEGORIES);
  currencies = _.cloneDeep(CURRENCIES);
  private destroy$ = new Subject<boolean>();

  private catSelected: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
  ) {
  }

  ngOnInit() {

    this.product$.pipe(
      filter(data => !!data),
      takeUntil(this.destroy$)
    ).subscribe(product => {
      // Filter categories
      this.categories.filter(category => {
        if (product.category.hasOwnProperty(category.value)) {
          category.selected = true;
        }
      });
      this.myGroup = this.formBuilder.group({
        name: [product.name || '', Validators.required],
        price: [product.price || '', Validators.required],
        description: [product.description || '', Validators.required],
        currency: [product.currency || 'DZD', Validators.required],
        isEnabled: [product.isEnabled || false, Validators.required],
        isSold: [product.isSold || false, Validators.required],
      });
    });
  }

  update() {
    const finalProduct: Product = this.getDirtyValues(this.myGroup) as any;
    finalProduct.category = Object.assign(parseCategoryList(this.catSelected));
    this.store.dispatch(new UpdateProductAction(finalProduct));
  }

  categorySelected(event: { detail: { value: any; }; }) {
    this.catSelected = [...event.detail.value];
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.next(false);
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
