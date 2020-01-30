import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { Product } from 'src/app/store/product/product.interface';
import { ProductsState, GetMoreProductsAction } from 'src/app/store/products';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  @Select(ProductsState.loading) loading$: Observable<boolean>;
  @Select(ProductsState.getAllProducts) products$: Observable<Product[]>;
  appInitilized = false;
  private destroy$ = new Subject<boolean>();
  constructor(
    private store: Store,
    private actions: Actions,
  ) {
  }

  ngOnInit(): void {
    this.appInitilized = true;
  }


  onClick() {
    this.store.dispatch(new GetMoreProductsAction(2));
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
