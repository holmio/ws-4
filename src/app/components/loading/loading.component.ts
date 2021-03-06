import { Component, OnInit } from '@angular/core';
import { LoadingController } from '@ionic/angular';
import { Actions, ofActionDispatched, ofActionCompleted } from '@ngxs/store';
import {
  LoginWithEmailAndPasswordAction,
  LoginWithFacebookAction,
  RegisterWithEmailAndPasswordAction
  } from 'src/app/store/auth';
import {
  GetProductAction,
  SetProductAction,
  DeleteProductAction,
  UpdateProductAction,
  } from 'src/app/store/product';
import { GetProductsAction } from 'src/app/store/products';
import {
  GetUserAction,
  SetUserAction,
  UpdateAvatarUserAction,
  UpdateUserAction,
  } from 'src/app/store/user';
import { GetChannelAction } from 'src/app/store/chat';

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
      ofActionDispatched(
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
        GetChannelAction,
      ),
    ).subscribe(async () => {
      this.count++;
      console.log('I: ' + this.count);
      this.toggleLoading(this.count);
    });

    this.actions.pipe(
      ofActionCompleted(
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
        GetChannelAction,
      ),
    ).subscribe((actions) => {
      this.count--;
      console.log('D: ' + this.count);
      console.log(actions);
      this.toggleLoading(this.count);
    });
  }

  private toggleLoading(loadingCount: number) {
    if (loadingCount > 0) {
      this.showLoading();
    } else {
      this.hideLoading();
    }
  }

  private showLoading() {
    if (this.spinner) {
      return;
    }

    this.spinner = new Promise((resolve) => {
      this.loadingController.create({
        spinner: 'bubbles'
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
    
    this.count = 0;
    this.spinner.then(spinner => spinner.dismiss());
    this.spinner = undefined;
  }

}
