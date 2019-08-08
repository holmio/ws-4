import { Component, OnInit } from '@angular/core';
import { Select } from '@ngxs/store';
import { ProductState, Product } from 'src/app/store/product';
import { Observable } from 'rxjs';
import { ModalController } from '@ionic/angular';

@Component({
  selector: 'app-modal-sliders',
  templateUrl: './modal-sliders.component.html',
  styleUrls: ['./modal-sliders.component.scss'],
})
export class ModalSlidersComponent implements OnInit {

  @Select(ProductState.getProduct) product$: Observable<Product>;
  slideOpts = {
    centeredSlides: true,
    preloadImages: false,
    lazy: true,
    scrollbar: {
      hide: true
    }
  };
  constructor(
    private modalController: ModalController,
  ) { }

  ngOnInit() {}

  closeModal() {
    this.modalController.dismiss();
  }

}
