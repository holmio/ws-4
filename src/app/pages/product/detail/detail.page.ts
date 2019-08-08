import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProductState, Product, GetProductAction, AddFavoriteAction, RemoveFavoriteAction, DeleteProductAction } from 'src/app/store/product';
import { Observable, Subject } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import { ModalSlidersComponent } from 'src/app/components/modal-sliders/modal-sliders.component';
import { AuthState } from 'src/app/store/auth';
import { take, tap, filter, takeUntil } from 'rxjs/operators';
import { ROUTE } from 'src/app/util/app.routes.const';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

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
  constructor(
    private route: ActivatedRoute,
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
      this.isLogin = true
    });
  }

  ngOnDestroy(): void {
    //Called once, before the instance is destroyed.
    //Add 'implements OnDestroy' to the class.
    this.destroy$.complete();
    this.destroy$.next(false);
  }

  addFavorite() {
    if (this.isLogin) {
      this.store.dispatch(new AddFavoriteAction());
      return;
    }
    this.router.navigateByUrl(ROUTE.login)
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
