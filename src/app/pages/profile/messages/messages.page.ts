import { Component, OnInit } from '@angular/core';
import { Store, Select } from '@ngxs/store';
import { ChatState, ChatDetail, GetChatsDetailAction } from 'src/app/store/chat';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-messages',
  templateUrl: './messages.page.html',
  styleUrls: ['./messages.page.scss'],
})
export class MessagesPage implements OnInit {

  @Select(ChatState.getChatsDetail) chatsDetail$: Observable<ChatDetail>;

  constructor(
    private store: Store,
  ) {
    this.store.dispatch(new GetChatsDetailAction());
  }

  ngOnInit() {
  }

}
