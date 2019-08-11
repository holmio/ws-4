import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { Select, Store, Actions, ofActionDispatched, ofAction, ofActionSuccessful } from '@ngxs/store';
import { ProductsState, GetProductsAction, GetProductsSuccessAction } from 'src/app/store/products';
import { ShortProduct } from 'src/app/store/product/product.interface';
import { IonRefresher } from '@ionic/angular';
import { takeUntil } from 'rxjs/operators';
import { LogoutSuccessAction, LoginFailedAction } from 'src/app/store/auth';
import { GetUserSuccessAction, GetUserFailedAction } from 'src/app/store/user';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  @Select(ProductsState.getAllProducts) products$: Observable<ShortProduct[]>;
  ionRefresh: IonRefresher;
  private destroy$ = new Subject<boolean>();
  constructor(
    private store: Store,
    private actions: Actions,
  ) {
  }

  ngOnInit(): void {
    this.actions.pipe(
      ofActionDispatched(GetProductsSuccessAction),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.ionRefresh) {
        this.ionRefresh.complete();
      }
    });
    this.actions.pipe(
      ofActionSuccessful(GetUserSuccessAction, GetUserFailedAction, LogoutSuccessAction, LoginFailedAction),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.store.dispatch(new GetProductsAction());
    });
  }

  doRefresh(event) {
    this.store.dispatch(new GetProductsAction());
    this.ionRefresh = event.target;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }
}
