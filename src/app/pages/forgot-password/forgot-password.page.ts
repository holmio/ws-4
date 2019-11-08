import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import { AuthService } from 'src/app/store/auth/auth.service';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.page.html',
  styleUrls: ['./forgot-password.page.scss'],
})
export class ForgotPasswordPage implements OnInit {

  emailForm: FormGroup;

  constructor(
    private authService: AuthService,
    private navController: NavController,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.emailForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  changePassword() {
    this.authService.resetPassword(this.emailForm.controls.email.value).then(() => {
      this.navController.back();
    });
  }

}
