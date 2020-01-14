import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Store } from '@ngxs/store';
import { ToastService } from 'src/app/services/toast/toast.services';
import { AuthService } from 'src/app/store/auth/auth.service';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.page.html',
  styleUrls: ['./reset-password.page.scss'],
})
export class ResetPasswordPage implements OnInit {

  resetPasswordForm: FormGroup;
  private code: string;

  constructor(
    private authService: AuthService,
    private translate: TranslateService,
    private formBuilder: FormBuilder,
    private toast: ToastService,
    private router: Router,
    private activRoute: ActivatedRoute,
  ) {
    this.activRoute.queryParams
      .subscribe(params => {
        this.code = params.actionCode;
        console.log(params);
      });
  }

  ngOnInit() {
    this.resetPasswordForm = this.formBuilder.group({
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required]
    }, {validator: this.checkPasswords});
  }

  private checkPasswords(group: FormGroup) { // here we have the 'passwords' group
    const pass = group.get('password').value;
    const confirmPass = group.get('confirmPassword').value;
    const isDirtyConfirmPass = group.get('confirmPassword').dirty;
    return pass === confirmPass || !isDirtyConfirmPass ? null : {notSame: true};
  }

  // convenience getter for easy access to form fields
  get formValue() {
    return this.resetPasswordForm.controls;
  }

  onSubmit() {
    this.authService.confirmPassword(this.code, this.formValue.password.value)
      .then(() => {
        this.toast.show({
          message: this.translate.instant('reset-password.toast.change-password.success'), color: 'success'
        }); // Contrasena cambiada
        this.router.navigateByUrl('/', {replaceUrl: true});
      }).catch((error) => {
        this.toast.show({message: error, color: 'danger'});
      });
  }
}
