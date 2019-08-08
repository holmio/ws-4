import { Component, OnInit, OnDestroy } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { ShortProduct } from 'src/app/store/product';
import { ProductService } from 'src/app/store/product/product.service';
import { AuthState } from 'src/app/store/auth';
import { filter, takeUntil } from 'rxjs/operators';
import { Select } from '@ngxs/store';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage implements OnInit, OnDestroy {

  products$: Observable<ShortProduct[]>;
  @Select(AuthState.getUid) uidUser$: Observable<string | undefined>;
  uidUser: string;
  private destroy$ = new Subject<boolean>();
  constructor(
    private productService: ProductService,
  ) {
  }

  ngOnInit(): void {
    this.uidUser$.pipe(
      filter((uid) => !!uid),
      takeUntil(this.destroy$)
    ).subscribe(uid => this.uidUser = uid);
    this.products$ = this.productService.getProducts();
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
    this.destroy$.next(false);
  }
}
