import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, Select, Actions, ofActionDispatched } from '@ngxs/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/store/user/user.interface';
import { UserState, UpdateUserAction, UpdateUserSuccessAction } from 'src/app/store/user';
import { take, filter, takeUntil } from 'rxjs/operators';
import { NavController } from '@ionic/angular';
import { APP_CONST } from 'src/app/util/app.constants';
import * as _ from 'lodash';

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

  constructor(
    private store: Store,
    private actions: Actions,
    private navController: NavController,
    private formBuilder: FormBuilder,
  ) { }



  ngOnInit() {
    this.user$.pipe(
      filter(data => !!data),
      takeUntil(this.destroy$)
    ).subscribe(user => {
      if (user.willaya) {
        this.dairas = [..._.find(this.willayas, { value: user.willaya }).dairas];
      }
      this.myGroup = this.formBuilder.group({
        name: [user.name || '', Validators.required],
        phone: [user.phone || '', Validators.required],
        localization: [user.localization || '', Validators.required],
        willaya: [user.willaya || '', Validators.required],
        daira: [{ value: user.daira || '', disabled: !user.willaya}, Validators.required],
      });
    });

    this.actions.pipe(
      ofActionDispatched(UpdateUserSuccessAction),
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

  onChangeWillaya(event) {
    const willayaSelected = event.target.value;
    this.dairas = [];
    this.dairas = [..._.find(this.willayas, { value: willayaSelected }).dairas];
    this.myGroup.controls['daira'].enable();
    console.log(this.dairas);
  }

}
