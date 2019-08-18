import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import {
  Actions,
  Select,
  Store,
  ofActionSuccessful
} from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import {
  filter,
  takeUntil,
  take,
} from 'rxjs/operators';
import { ModalSlidersComponent } from 'src/app/components/modal-sliders/modal-sliders.component';
import { AuthState } from 'src/app/store/auth';
import {
  AddFavoriteAction,
  DeleteProductAction,
  GetProductAction,
  Product,
  ProductState,
  RemoveFavoriteAction,
  DeleteProductSuccessAction,
  GetUserProductAction,
  GetProductSuccessAction,
  UpdateProductSuccessAction
} from 'src/app/store/product';
import { ROUTE } from 'src/app/util/app.routes.const';
import { UserShortInfo } from 'src/app/store/user';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit, OnDestroy {

  @Select(ProductState.loading) loading$: Observable<boolean>;
  @Select(ProductState.getIsFavorite) isFavorite$: Observable<boolean>;
  @Select(ProductState.getUserOfProduct) ownerOfProduct$: Observable<UserShortInfo>;
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
    this.uid$.pipe(
      filter((uid) => !!uid),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.isLogin = true;
    });

    this.store.dispatch(new GetProductAction(this.id));
    this.actions.pipe(
      ofActionSuccessful(GetProductSuccessAction),
      take(1)
    ).subscribe(() => {
      this.store.dispatch(new GetUserProductAction());
    });

    this.actions.pipe(
      ofActionSuccessful(UpdateProductSuccessAction),
    ).subscribe(() => {
      setTimeout(() => {
        this.store.dispatch(new GetProductAction(this.id));
      }, 500);
    });

    this.actions.pipe(
      ofActionSuccessful(DeleteProductSuccessAction),
      take(1)
    ).subscribe(() => {
      this.navController.back();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
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
