import { Component, OnInit, Input } from '@angular/core';
import { ShortProduct } from 'src/app/store/product';

@Component({
  selector: 'app-product-card',
  templateUrl: './product-card.component.html',
  styleUrls: ['./product-card.component.scss'],
})
export class ProductCardComponent implements OnInit {

  @Input() product: ShortProduct;

  constructor() { }

  ngOnInit() {}

}
