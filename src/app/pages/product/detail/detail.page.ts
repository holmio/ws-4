import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProductState, Product, GetProductAction, AddFavoriteAction, RemoveFavoriteAction, DeleteProductAction } from 'src/app/store/product';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';
import { ModalController } from '@ionic/angular';
import { ModalSlidersComponent } from 'src/app/components/modal-sliders/modal-sliders.component';

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
  id: string;
  slideOpts = {
    centeredSlides: true,
    preloadImages: false,
    lazy: true,
  };
  constructor(
    private route: ActivatedRoute,
    private modalController: ModalController,
    private store: Store,
  ) {
    this.id = this.route.snapshot.params.id;
  }

  ngOnInit() {
    this.store.dispatch(new GetProductAction(this.id));
  }

  addFavorite() {
    this.store.dispatch(new AddFavoriteAction(this.id));
  }

  removeFavorite() {
    this.store.dispatch(new RemoveFavoriteAction(this.id));
  }

  delete() {
    this.store.dispatch(new DeleteProductAction());
  }

  private async presentModal() {
    const modal = await this.modalController.create({
      component: ModalSlidersComponent,
    });
    return await modal.present();
  }

}
