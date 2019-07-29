import { Component, OnInit } from '@angular/core';
import { UserDetail } from 'src/app/store/user/user.interface';
import { Select } from '@ngxs/store';
import { UserState } from 'src/app/store/user';
import { Observable } from 'rxjs';
import { ProductService, ProductState, ShortProduct } from 'src/app/store/product';
import { AuthState } from 'src/app/store/auth';
import { filter, take } from 'rxjs/operators';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.page.html',
  styleUrls: ['./detail.page.scss'],
})
export class DetailPage implements OnInit {

  @Select(UserState.geUser) user$: Observable<UserDetail | undefined>;
  selectSegment = 'products';
  favorites: ShortProduct[] = [];
  
  constructor(
    private productService: ProductService,
  ) { }

  ngOnInit() {
    this.user$.pipe(
      filter(data => !!data),
    ).subscribe(data => {
      this.favorites = [...this.productService.getFavoritesProducts(data.favorites)];
    })
  }

}
