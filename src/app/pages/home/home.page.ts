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
  @Select(ProductState.getProduct) product$: Observable<string | undefined>;

  constructor(
    private productService: ProductService,
  ) {
  }

  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.products$ = this.productService.getProductShort();
  }

  ngAfterContentInit(): void {
  }

  login() {
  }

}
