import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Store, Actions, ofActionDispatched } from '@ngxs/store';
import { APP_CONST } from 'src/app/util/app.constants';
import { SetProductAction, Product, SetProductSuccessAction } from 'src/app/store/product';
import { NavController } from '@ionic/angular';
import * as _ from 'lodash';
import { take } from 'rxjs/operators';
import { Subject } from 'rxjs';

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
    private actions: Actions,
    private navController: NavController,
  ) { }

  ngOnInit() {
    this.myGroup = this.formBuilder.group({
      name: ['', Validators.required],
      price: ['', Validators.required],
      description: ['', Validators.required],
      willaya: ['', Validators.required],
      daira: [{ value: '', disabled: true}, Validators.required],
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
      // return this.toastService.show('[T]Necesitas subir minimo una foto del producto', 'warning');
    }
    const productInfo: Product = {
      gallery: [...this.imagesSelected],
      ...this.myGroup.value
    };
    this.store.dispatch(new SetProductAction(productInfo));
  }

  onChangeWillaya(event) {
    const willayaSelected = event.target.value;
    this.getDaira(willayaSelected);
    this.myGroup.controls['daira'].enable();
  }

  private getDaira(willaya: string) {
    if (!willaya) {
      return;
    }
    this.dairas = [];
    this.dairas = [..._.find(this.willayas, { value: willaya })['dairas']];
  }

  

}
