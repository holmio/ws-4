import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Actions, Select } from '@ngxs/store';
import { combineLatest, Observable } from 'rxjs';
import { LoadingState } from 'src/app/interfaces/common.interface';
import { AuthState } from 'src/app/store/auth';
import { ProductState } from 'src/app/store/product';
import { ProductsState } from 'src/app/store/products';
import { UserState } from 'src/app/store/user';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-loading',
  template: ''
})
export class LoadingComponent implements OnInit {

  private spinner: any;
  @Select(UserState.loading) loadingUser$: Observable<boolean>;
  @Select(AuthState.loading) loadingAuth$: Observable<boolean>;

  constructor(
    private loadingController: LoadingController,

  ) {}

  ngOnInit(): void {
    combineLatest(
      this.loadingUser$,
      this.loadingAuth$,
    ).subscribe((status: any) => {
      if (!status.includes(true)) {
        this.hideLoading();
      } else {
        this.showLoading();
      }
    });
  }

  private showLoading() {
    if (this.spinner) {
      return;
    }

    this.spinner = new Promise((resolve) => {
      this.loadingController.create({
        spinner: 'circular'
      }).then((spinner) => {
        spinner.present().then(() => {
          resolve(spinner);
        });
      });
    });
  }

  private hideLoading() {
    if (!this.spinner) {
      return;
    }

    this.spinner.then(spinner => spinner.dismiss());
    this.spinner = undefined;
  }

}
