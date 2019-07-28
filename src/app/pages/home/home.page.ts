import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductState, ShortProduct } from 'src/app/store/product';
import { ProductService } from 'src/app/store/product/product.service';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterContentInit {

  products$: Observable<ShortProduct[]>;

  constructor(
    private productService: ProductService,
  ) {
  }

  ngOnInit(): void {
    this.products$ = this.productService.getProducts();
  }

  ngAfterContentInit(): void {
  }

  login() {
  }

}
