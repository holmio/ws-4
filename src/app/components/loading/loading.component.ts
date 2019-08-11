import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Actions, ofAction, ofActionDispatched, ofActionSuccessful } from '@ngxs/store';
import {
  CheckSessionAction,
  LoginFailedAction,
  LoginSuccessAction,
  LoginWithEmailAndPasswordAction,
  LoginWithFacebookAction,
  RegisternFailedAction,
  RegisterSuccessAction,
  RegisterWithEmailAndPasswordAction
  } from 'src/app/store/auth';
import {
  GetProductAction,
  GetProductFailedAction,
  GetProductSuccessAction,
  SetProductAction,
  SetProductFailedAction,
  SetProductSuccessAction,
  DeleteProductAction,
  UpdateProductAction,
  DeleteProductSuccessAction,
  DeleteProductFailedAction,
  UpdateProductSuccessAction,
  UpdateProductFailedAction
  } from 'src/app/store/product';
import { GetProductsAction, GetProductsFailedAction, GetProductsSuccessAction } from 'src/app/store/products';
import {
  GetUserAction,
  GetUserFailedAction,
  GetUserSuccessAction,
  SetUserAction,
  SetUserFailedAction,
  SetUserSuccessAction,
  UpdateAvatarUserAction,
  UpdateUserAction,
  UpdateAvatarUserSuccessAction,
  UpdateAvatarUserFailedAction,
  UpdateUserSuccessAction,
  UpdateUserFailedAction
  } from 'src/app/store/user';

@Component({
  selector: 'app-loading',
  template: ''
})
export class LoadingComponent implements OnInit {

  private count = 0;
  private spinner: any;

  constructor(
    private loadingController: LoadingController,
    private actions: Actions,

  ) { }

  ngOnInit(): void {
    this.actions.pipe(
      ofAction(
        CheckSessionAction,
        SetUserAction,
        SetProductAction,
        GetUserAction,
        GetProductAction,
        GetProductsAction,
        LoginWithEmailAndPasswordAction,
        LoginWithFacebookAction,
        RegisterWithEmailAndPasswordAction,
        DeleteProductAction,
        UpdateAvatarUserAction,
        UpdateProductAction,
        UpdateUserAction,
      ),
    ).subscribe(async () => {
      this.count++;
      this.toggleLoading(this.count);
    });

    this.actions.pipe(
      ofAction(
        SetUserSuccessAction,
        SetUserFailedAction,
        SetProductSuccessAction,
        SetProductFailedAction,
        GetUserSuccessAction,
        GetUserFailedAction,
        GetProductsSuccessAction,
        GetProductsFailedAction,
        GetProductSuccessAction,
        GetProductFailedAction,
        LoginSuccessAction,
        LoginFailedAction,
        RegisterSuccessAction,
        RegisternFailedAction,
        DeleteProductSuccessAction,
        DeleteProductFailedAction,
        UpdateAvatarUserSuccessAction,
        UpdateAvatarUserFailedAction,
        UpdateProductSuccessAction,
        UpdateProductFailedAction,
        UpdateUserSuccessAction,
        UpdateUserFailedAction,
      ),
    ).subscribe(() => {
      this.count--;
      this.toggleLoading(this.count);
    });
  }

  private toggleLoading(loadingCount: number) {
    if (loadingCount > 0) {
      this.showLoading();
    } else {
      this.count = 0;
      this.hideLoading();
    }
  }

  private showLoading() {
    if (this.spinner) {
      return;
    }

    this.spinner = new Promise((resolve) => {
      this.loadingController.create({}).then((spinner) => {
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
