import { Component, OnInit, AfterContentInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { ProductState, ShortProduct } from 'src/app/store/product';
import { ProductService } from 'src/app/store/product/product.service';
import { AuthState } from 'src/app/store/auth';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, AfterContentInit {

  products$: Observable<ShortProduct[]>;
  @Select(AuthState.getUid) uidUser$: Observable<string | undefined>;
  uidUser: string;


  constructor(
    private productService: ProductService,
  ) {
  }

  ngOnInit(): void {
    this.uidUser$.pipe(
      filter((uid) => !!uid),
      take(1)
    ).subscribe(uid => this.uidUser = uid);
    this.products$ = this.productService.getProducts();
  }

  ngAfterContentInit(): void {
  }

  login() {
  }

}
