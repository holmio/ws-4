import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalController, NavController } from '@ionic/angular';
import {
  Actions,
  ofActionSuccessful,
  Select,
  Store
  } from '@ngxs/store';
import { Observable, Subject } from 'rxjs';
import { ModalSlidersComponent } from 'src/app/components/modal-sliders/modal-sliders.component';
import { AuthState } from 'src/app/store/auth';
import {
  AddFavoriteAction,
  DeleteProductAction,
  DeleteProductSuccessAction,
  DistroyProductAction,
  GetProductAction,
  GetProductSuccessAction,
  GetUserProductAction,
  Product,
  ProductState,
  RemoveFavoriteAction
  } from 'src/app/store/product';
import { UserShortInfo } from 'src/app/store/user';
import { ROUTE } from 'src/app/util/app.routes.const';
import {
  filter,
  takeUntil,
  take,
} from 'rxjs/operators';
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
  chatId: string;
  slideOpts = {
    centeredSlides: true,
    preloadImages: false,
    lazy: true,
  };

  private isLogin = false;
  private destroy$ = new Subject<boolean>();
  constructor(
    private activRoute: ActivatedRoute,
    private actions: Actions,
    private navController: NavController,
    private router: Router,
    private modalController: ModalController,
    private store: Store,
  ) {
    this.id = this.activRoute.snapshot.params.id;
  }

  ngOnInit() {
    this.uid$.pipe(
      filter((uid) => !!uid),
      takeUntil(this.destroy$)
    ).subscribe((userUid) => {
      this.isLogin = true;
      if (this.isLogin) {
        this.chatId = userUid + this.id;
      }
    });

    this.store.dispatch(new GetProductAction(this.id));
    this.actions.pipe(
      ofActionSuccessful(GetProductSuccessAction),
      take(1)
    ).subscribe(() => {
      this.store.dispatch(new GetUserProductAction());
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
    this.store.dispatch(new DistroyProductAction());
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
