import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Store } from '@ngxs/store';
import { RegisterWithEmailAndPasswordAction } from 'src/app/store/auth';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit {

  registerForm: FormGroup;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
  ) {}

  ngOnInit() {
    this.registerForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  // convenience getter for easy access to form fields
  get formValue() {
    return this.registerForm.controls;
  }

  onSubmit() {
    this.store.dispatch(new RegisterWithEmailAndPasswordAction(
      this.formValue.name.value,
      this.formValue.email.value,
      this.formValue.password.value
    ));
  }

}
