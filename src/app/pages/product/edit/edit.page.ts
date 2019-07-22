import { Component, OnInit } from '@angular/core';
import { Select, Store } from '@ngxs/store';
import { ProductState, Product, UpdateProductAction } from 'src/app/store/product';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { filter, take } from 'rxjs/operators';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  @Select(ProductState.loading) loading$: Observable<boolean>;
  @Select(ProductState.getProduct) product$: Observable<Product>;
  myGroup: FormGroup;
  categories: any = [
    { value: 'ropa', nameEs: 'Ropa', selected: false },
    { value: 'mujer', nameEs: 'Mujer', selected: false },
    { value: 'play', nameEs: 'Play', selected: false },
    { value: 'cabra', nameEs: 'Cabra', selected: false },
    { value: 'melfa', nameEs: 'Melfa', selected: false },
    { value: 'coche', nameEs: 'coche', selected: false },
    { value: 'otro', nameEs: 'Otro', selected: false },
  ]
  currencies: any = [
    { value: 'DZD', nameAr: 'دينار', nameEs: 'Dinar', selected: false },
    { value: 'EUR', nameAr: 'اليورو', nameEs: 'Euro', selected: false },
  ]
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
  ) {
  }

  ngOnInit() {

    this.product$.pipe(
      filter(data => !!data),
      take(1)
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
    const finalProduct: Product = <any>this.getDirtyValues(this.myGroup);
    this.store.dispatch(new UpdateProductAction(finalProduct));
  }

  getDirtyValues(form: any) {
    let dirtyValues = {};

    Object.keys(form.controls)
      .forEach(key => {
        let currentControl = form.controls[key];

        if (currentControl.dirty) {
          if (currentControl.controls)
            dirtyValues[key] = this.getDirtyValues(currentControl);
          else
            dirtyValues[key] = currentControl.value;
        }
      });

    return dirtyValues;
  }

}
