import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { UserDetail } from 'src/app/store/user/user.interface';
import { UserState, UpdateUserAction } from 'src/app/store/user';
import { take, filter } from 'rxjs/operators';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit {

  @Select(UserState.geUser) user$: Observable<UserDetail | undefined>;
  myGroup: FormGroup;

  constructor(
    private store: Store,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.user$.pipe(
      filter(data => !!data),
      take(1)
    ).subscribe(user => {
      this.myGroup = this.formBuilder.group({
        fullName: [user.fullName || '', Validators.required],
        phone: [user.phone || '', Validators.required],
        localization: [user.localization || '', Validators.required]
      });
    });
  }

  update() {
    this.store.dispatch(new UpdateUserAction(this.myGroup.value));
  }

}
