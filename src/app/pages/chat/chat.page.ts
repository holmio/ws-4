import { ActivatedRoute } from '@angular/router';
import { AuthState } from 'src/app/store/auth';
import { Channel, Chat, ChatState, GetChatAction, SendMessageAction, SetChannelAction, GetChatSuccessAction, GetChannelAction } from 'src/app/store/chat';
import { Component, OnInit, ViewChild } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable } from 'rxjs';
import { Select, Store, Actions, ofActionSuccessful, ofActionDispatched } from '@ngxs/store';
import { take } from 'rxjs/operators';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('IonContent') content: IonContent;

  id: string;
  messageInput = '';
  show: boolean;

  @Select(ChatState.getChat) chat$: Observable<Chat>;
  @Select(ChatState.getChannel) channelInfo$: Observable<Channel>;
  @Select(AuthState.getUid) uid$: Observable<string | undefined>;

  isFirstTime: boolean;
  private fromProduct: boolean;

  constructor(
    private actions: Actions,
    private store: Store,
    private activRoute: ActivatedRoute
  ) {
    this.activRoute.queryParams
      .subscribe(params => {
        this.id = params.id;
        this.fromProduct = params.fromProduct === 'true';
        this.store.dispatch(new GetChatAction(this.id));
      });
  }

  ngOnInit() {
    this.actions.pipe(
      ofActionDispatched(GetChatSuccessAction),
      take(1)
    ).subscribe((action) => {
      if (action.chat) {
        this.isFirstTime = false;
        if (this.fromProduct) {
          this.store.dispatch(new GetChannelAction(this.id));
        }
      } else {
        this.isFirstTime = true;
      }
    });
  }

  toggleList() {
    this.show = !this.show;
    console.log(this.show);
    this.scrollDown();
  }

  sendMsg() {
    if (this.messageInput !== '') {
      if (this.isFirstTime) {
        this.store.dispatch(new SetChannelAction(this.messageInput));
      } else {
        this.store.dispatch(new SendMessageAction(this.messageInput));
      }

      this.messageInput = '';
      this.scrollDown();

    }
    this.show = false;
  }

  scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom(50);
    }, 200);
  }
  something($event: any) {
    $event.preventDefault();
    console.log($event);
  }
  userTyping(event: any) {
    this.show = false;
    console.log(event);
    this.scrollDown();
  }
  focusFunction(event: any) {
    this.show = false;
    console.log(event);
  }
}
