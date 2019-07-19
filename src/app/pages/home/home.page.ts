import { Component } from '@angular/core';
import { AuthService } from 'src/app/store/auth/auth.service';
import { LoginWithEmailAndPasswordAction, LogoutAction } from 'src/app/store/auth';
import { Store, Select } from '@ngxs/store';
import { Router } from '@angular/router';
import {Observable} from 'rxjs';
import {ProductState, GetProductAction} from 'src/app/store/product';
import {filter, take} from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {

  @Select(ProductState.getProduct) product$: Observable<string | undefined>;

  constructor(private store: Store, private router: Router) {
    this.store.dispatch(new GetProductAction('dsb6RRkPkOQRtZfWkIQZ'));
    this.product$.pipe(
        filter(data => !!data),
        take(1),
    ).subscribe((data) => {
        console.log(data);
    });
  }

  login() {
  }

}
