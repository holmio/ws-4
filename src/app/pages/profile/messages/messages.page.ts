import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ChatState, Channel, GetChannelsAction, GetChannelSuccessAction } from 'src/app/store/chat';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  @Select(ChatState.getChannels) channels$: Observable<Channel>;

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
