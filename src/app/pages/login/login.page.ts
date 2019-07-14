import { Component, OnInit } from '@angular/core';
import { LoginWithEmailAndPasswordAction, LoginWithFacebookAction } from 'src/app/store/auth';
import { Store } from '@ngxs/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {

  loginForm: FormGroup;
  
  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
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
