import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Actions, ofActionSuccessful, Store } from '@ngxs/store';
import { take } from 'rxjs/operators';
import { LoginSuccessAction, LoginWithEmailAndPasswordAction, LoginWithFacebookAction } from 'src/app/store/auth';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  loginForm: FormGroup;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
    private navController: NavController,
    private actions: Actions,
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    this.actions.pipe(
      ofActionSuccessful(LoginSuccessAction),
      take(1)
    ).subscribe(() => {
      this.navController.back();
    });
  }

  ngOnDestroy(): void {
  }

  // convenience getter for easy access to form fields
  get formValue() {
    return this.loginForm.controls;
  }

  loginWithEmailAndPassword() {
    this.store.dispatch(new LoginWithEmailAndPasswordAction(this.formValue.email.value, this.formValue.password.value));
  }

  loginWithFacebook() {
    this.store.dispatch(new LoginWithFacebookAction());
  }
}
