import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { IonRefresher, ModalController, NavController } from '@ionic/angular';
import {
  Actions,
  ofActionDispatched,
  Select,
  Store
} from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import {
  filter,
  takeUntil,
} from 'rxjs/operators';
import { ModalSlidersComponent } from 'src/app/components/modal-sliders/modal-sliders.component';
import { AuthState, LogoutSuccessAction, LoginSuccessAction } from 'src/app/store/auth';
import {
  AddFavoriteAction,
  DeleteProductAction,
  GetProductAction,
  Product,
  ProductState,
  RemoveFavoriteAction,
  DeleteProductSuccessAction
} from 'src/app/store/product';
import { GetProductsSuccessAction } from 'src/app/store/products';
import { ROUTE } from 'src/app/util/app.routes.const';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, OnDestroy {

  @Select(ProductState.loading) loading$: Observable<boolean>;
  @Select(ProductState.getIsFavorite) isFavorite$: Observable<boolean>;
  @Select(ProductState.getProduct) product$: Observable<Product>;
  @Select(ProductState.getIsUserProduct) isUserProduct$: Observable<boolean>;
  @Select(AuthState.getUid) uid$: Observable<string | undefined>;

  id: string;
  slideOpts = {
    centeredSlides: true,
    preloadImages: false,
    lazy: true,
  };
  private isLogin = false;
  private destroy$ = new Subject<boolean>();
  private ionRefresh: IonRefresher;
  constructor(
    private route: ActivatedRoute,
    private actions: Actions,
    private navController: NavController,
    private router: Router,
    private modalController: ModalController,
    private store: Store,
  ) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.store.dispatch(new GetProductAction(this.id));
    this.uid$.pipe(
      filter((uid) => !!uid),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.isLogin = true;
    });

    this.actions.pipe(
      ofActionDispatched(GetProductsSuccessAction),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      if (this.ionRefresh) {
        this.ionRefresh.complete();
      }
    });

    this.actions.pipe(
      ofActionDispatched(LogoutSuccessAction, LoginSuccessAction),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.store.dispatch(new GetProductAction(this.id));
    });

    this.actions.pipe(
      ofActionDispatched(DeleteProductSuccessAction),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.navController.back();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  doRefresh(event) {
    this.store.dispatch(new GetProductAction(this.id));
    this.ionRefresh = event.target;
  }

  addFavorite() {
    if (this.isLogin) {
      this.store.dispatch(new AddFavoriteAction());
      return;
    }
    this.router.navigateByUrl(ROUTE.login);
  }

  removeFavorite() {
    this.store.dispatch(new RemoveFavoriteAction());
  }

  delete() {
    this.store.dispatch(new DeleteProductAction());
  }

  async presentModal() {
    const modal = await this.modalController.create({
      component: ModalSlidersComponent,
    });
    return await modal.present();
  }

}
