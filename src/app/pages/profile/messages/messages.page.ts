import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Select, Store } from '@ngxs/store';
import { Observable } from 'rxjs';
import { AuthState } from 'src/app/store/auth';
import { Channel, ChatState, GetChannelsAction, GetChannelSuccessAction } from 'src/app/store/chat';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  @Select(ChatState.getChannels) channels$: Observable<Channel[]>;
  @Select(AuthState.getUid) uid$: Observable<string | undefined>;

  constructor(
    private store: Store,
    private router: Router,
  ) {
    this.store.dispatch(new GetChannelsAction());
  }

  ngOnInit() {
  }

  goToChannel(channel: Channel) {
    this.store.dispatch(new GetChannelSuccessAction(channel));
    this.router.navigate([`chat/${channel.uid}`], {queryParams: {id: channel.uid}});
  }

}
