import { Component, OnDestroy, OnInit } from '@angular/core';
import { IonRefresher } from '@ionic/angular';
import {
  Actions,
  ofAction,
  ofActionDispatched,
  ofActionSuccessful,
  Select,
  Store
  } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { LoginFailedAction, LogoutSuccessAction } from 'src/app/store/auth';
import { ShortProduct } from 'src/app/store/product/product.interface';
import { GetProductsAction, ProductsState } from 'src/app/store/products';
import { GetUserFailedAction, GetUserSuccessAction } from 'src/app/store/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  @Select(ProductsState.getAllProducts) products$: Observable<ShortProduct[]>;
  private destroy$ = new Subject<boolean>();
  constructor(
    private store: Store,
    private actions: Actions,
  ) {
  }

  ngOnInit(): void {
    this.actions.pipe(
      ofActionSuccessful(GetUserSuccessAction, GetUserFailedAction, LogoutSuccessAction, LoginFailedAction),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.store.dispatch(new GetProductsAction());
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
