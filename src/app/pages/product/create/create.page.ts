import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { CATEGORIES, CURRENCIES } from 'src/app/util/app.constants';
import { SetProductAction } from 'src/app/store/product';

@Component({
  selector: 'app-create',
  templateUrl: './create.page.html',
  styleUrls: ['./create.page.scss'],
})
export class CreatePage implements OnInit {

  myGroup: FormGroup;
  categories = CATEGORIES;
  currencies = CURRENCIES;

  constructor(
    private formBuilder: FormBuilder,
    private store: Store, 
  ) { }

  ngOnInit() {
    this.myGroup = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      currency: ['DZD', Validators.required],
    });
  }

  create() {
    this.store.dispatch(new SetProductAction(this.myGroup.value));
  }
}
