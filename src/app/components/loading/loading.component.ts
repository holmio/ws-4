import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Actions, ofAction } from '@ngxs/store';
import { GetUserSuccessAction, GetUserAction } from 'src/app/store/user';
import { GetProductsAction, GetProductsSuccessAction } from 'src/app/store/products';

@Component({
  selector: 'app-loading',
  template: ''
})
export class LoadingComponent implements OnInit {

  private count = 0;
  private loading: any;

  constructor(
    private loadingController: LoadingController,
    private actions: Actions,

  ) { }

  ngOnInit(): void {
    this.presentLoading();
    this.actions.pipe(
      ofAction(
        GetUserAction,
        GetProductsAction,
      ),
    ).subscribe(async () => {
      this.count++;
      await this.loading.present();
    });

    this.actions.pipe(
      ofAction(
        GetUserSuccessAction,
        GetProductsSuccessAction
      ),
    ).subscribe(() => {
      this.count--;
      if (this.count === 0) {
        this.loading.dismiss();
      }
    });
  }
  private async presentLoading() {
    this.loading = await this.loadingController.create({
      message: 'Hellooo',
    });
  }

}
