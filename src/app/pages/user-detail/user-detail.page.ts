import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserState, VisitedUser, GetVisitedUserAction } from 'src/app/store/user';
import { Observable } from 'rxjs';
import { Select, Store } from '@ngxs/store';

@Component({
  selector: 'app-user-detail',
  templateUrl: './user-detail.page.html',
  styleUrls: ['./user-detail.page.scss'],
})
export class UserDetailPage implements OnInit {
  id: string;
  @Select(UserState.getVisitedUser) visitedUser$: Observable<VisitedUser | undefined>;
  selectSegment = 'products';
  constructor(
    private activRoute: ActivatedRoute,
    private store: Store,
  ) {
    this.id = this.activRoute.snapshot.params.id;
  }

  ngOnInit() {
    this.store.dispatch(new GetVisitedUserAction(this.id));
  }

}
