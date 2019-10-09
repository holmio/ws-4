import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { NavController } from '@ionic/angular';
import {
  Actions,
  ofActionDispatched,
  ofActionSuccessful,
  Select,
  Store
} from '@ngxs/store';
import * as _ from 'lodash';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { UpdateUserAction, UpdateUserSuccessAction, UserState } from 'src/app/store/user';
import { User } from 'src/app/store/user/user.interface';
import { APP_CONST } from 'src/app/util/app.constants';
import { AuthService } from 'src/app/store/auth/auth.service';
import { ToastService } from 'src/app/services/toast/toast.services';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, OnDestroy {

  @Select(UserState.geUser) user$: Observable<User | undefined>;
  myGroup: FormGroup;
  willayas = _.cloneDeep(APP_CONST.willayas);
  dairas = [];
  currencies = _.cloneDeep(APP_CONST.currencies);
  private destroy$ = new Subject<boolean>();
  private email: string;

  constructor(
    private store: Store,
    private toast: ToastService,
    private actions: Actions,
    private navController: NavController,
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) { }



  ngOnInit() {
    this.user$.pipe(
      filter(data => !!data),
      takeUntil(this.destroy$)
    ).subscribe(user => {
      this.email = user.email;
      this.getDaira(user.willaya);
      this.myGroup = this.formBuilder.group({
        name: [user.name || '', Validators.required],
        phone: [user.phone || '', Validators.required],
        willaya: [user.willaya || '', Validators.required],
        daira: [{ value: user.daira || '', disabled: !user.willaya }, Validators.required],
      });
    });

    this.actions.pipe(
      ofActionSuccessful(UpdateUserSuccessAction),
      takeUntil(this.destroy$)
    ).subscribe(() => {
      this.navController.back();
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  update() {
    this.store.dispatch(new UpdateUserAction(this.myGroup.value));
  }

  resetPassword() {
    this.authService.resetPassword(this.email).then(() => {
      this.toast.show({ message: '[T]Te hemos enviado el email para cambiar la contraseña' });
    }).catch(() => {
      this.toast.show({ message: '[T]No ha sido posible enviarte el email, intentalo más tarde', color: 'danger' });
    });
  }

  onChangeWillaya(event) {
    const willayaSelected = event.target.value;
    this.getDaira(willayaSelected);
    this.myGroup.controls.daira.enable();
    console.log(this.dairas);
  }

  private getDaira(willaya: string) {
    if (!willaya) {
      return;
    }
    this.dairas = [];
    this.dairas = [..._.find(this.willayas, { value: willaya }).dairas];
  }

}
