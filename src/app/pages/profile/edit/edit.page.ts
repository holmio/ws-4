import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store, Select, Actions, ofActionDispatched } from '@ngxs/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { User } from 'src/app/store/user/user.interface';
import { UserState, UpdateUserAction, UpdateUserSuccessAction } from 'src/app/store/user';
import { take, filter, takeUntil } from 'rxjs/operators';
import { NavController } from '@ionic/angular';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, OnDestroy {

  @Select(UserState.geUser) user$: Observable<User | undefined>;
  myGroup: FormGroup;
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
      this.myGroup = this.formBuilder.group({
        name: [user.name || '', Validators.required],
        phone: [user.phone || '', Validators.required],
        localization: [user.localization || '', Validators.required]
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

}
