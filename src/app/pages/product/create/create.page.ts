import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CATEGORIES, CURRENCIES } from 'src/app/util/app.constants';
import { SetProductAction } from 'src/app/store/product';
import { IonSelect } from '@ionic/angular';
import { parseCategoryList } from 'src/app/util/common';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  myGroup: FormGroup;
  categories = CATEGORIES;
  currencies = CURRENCIES;
  private catSelected: string[] = [];
  constructor(
    private formBuilder: FormBuilder,
    private store: Store,
  ) { }

  ngOnInit() {
    this.myGroup = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      localization: ['', Validators.required],
      currency: ['DZD', Validators.required],
      category: ['ropa', Validators.required],
    });
  }

  categorySelected(event: { detail: { value: any; }; }) {
    this.catSelected = [...event.detail.value];
  }

  create() {
    this.myGroup.value.category = Object.assign(parseCategoryList(this.catSelected));
    if (this.catSelected.length === 0) {
      return;
    }
    this.store.dispatch(new SetProductAction(this.myGroup.value));
    console.log('Tienes que seleccionar categoria');
  }
}
