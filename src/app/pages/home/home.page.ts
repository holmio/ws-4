import { Component, OnDestroy, OnInit } from '@angular/core';
import { Actions, ofActionSuccessful, Select, Store } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginFailedAction, LogoutSuccessAction } from 'src/app/store/auth';
import { Product } from 'src/app/store/product/product.interface';
import { GetProductsAction, ProductsState } from 'src/app/store/products';
import { GetUserFailedAction, GetUserSuccessAction } from 'src/app/store/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  @Select(ProductsState.loading) loading$: Observable<boolean>;
  @Select(ProductsState.getAllProducts) products$: Observable<Product[]>;
  private destroy$ = new Subject<boolean>();
  constructor(
    private store: Store,
    private actions: Actions,
  ) {
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.unsubscribe();
  }
}
