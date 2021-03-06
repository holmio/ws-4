import { Component, OnInit, OnDestroy } from '@angular/core';
import { LoginWithEmailAndPasswordAction, LoginWithFacebookAction, LoginSuccessAction } from 'src/app/store/auth';
import { Store, Actions, ofActionDispatched, ofActionSuccessful } from '@ngxs/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { Subject } from 'rxjs';
import { takeUntil, take } from 'rxjs/operators';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit, OnDestroy {

  loginForm: FormGroup;
  private destroy$ = new Subject<boolean>();
  
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
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }

  loginWithEmailAndPassword() {
    this.store.dispatch(new LoginWithEmailAndPasswordAction(this.f.email.value, this.f.password.value));
  }

  loginWithFacebook() {
    this.store.dispatch(new LoginWithFacebookAction());
  }
}
