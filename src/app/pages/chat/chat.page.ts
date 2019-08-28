import { Actions, ofActionDispatched, Select, Store } from '@ngxs/store';
import { ActivatedRoute } from '@angular/router';
import { AuthState } from 'src/app/store/auth';
import {
  Channel, ChatState, GetChannelAction, GetChannelSuccessAction,
  SendMessageAction, SetChannelAction, UpdateChannelAction, GetChannelFailedAction, Message
} from 'src/app/store/chat';
import { ChatService } from 'src/app/store/chat/chat.service';
import { Component, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { IonContent } from '@ionic/angular';
import { Observable, Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';
import * as moment from 'moment';
import * as _ from 'lodash';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit, OnDestroy {
  @ViewChild('IonContent') content: IonContent;

  id: string;
  messageInput = '';
  show: boolean;

  messages$: Observable<Message[]>;
  @Select(ChatState.getChannel) channelInfo$: Observable<Channel>;
  @Select(AuthState.getUid) uid$: Observable<string | undefined>;

  isFirstTime: boolean;
  private fromProduct: boolean;
  private messages = [];
  private distroy$ = new Subject();
  constructor(
    private actions: Actions,
    private chatService: ChatService,
    private store: Store,
    private activRoute: ActivatedRoute,
  ) {
    this.activRoute.queryParams
      .subscribe(params => {
        this.id = params.id;
        this.fromProduct = params.fromProduct === 'true';
        if (this.fromProduct) {
          this.store.dispatch(new GetChannelAction(this.id));
        }
        this.messages$ = this.chatService.getMessages(this.id);
      });
  }

  ngOnInit() {
    this.actions.pipe(
      ofActionDispatched(GetChannelSuccessAction),
      take(1)
    ).subscribe((action) => {
      if (action.channel) {
        this.isFirstTime = false;
        this.store.dispatch(new UpdateChannelAction());
      }
    });
    this.actions.pipe(
      ofActionDispatched(GetChannelFailedAction),
    ).subscribe((action) => {
      if (!action.error) {
        this.isFirstTime = true;
      }
    });

    this.messages$.pipe(takeUntil(this.distroy$)).subscribe((messages: Message[]) => {
      this.messages = _.cloneDeep(messages);
    });
  }

  ngOnDestroy(): void {

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
  diffDates(index) {
    if (index === 0) return true;
    // To calculate the time difference of two dates
    const d1 = new Date(this.messages[index].timestamp).getTime() / (1000 * 3600 * 24);
    const d2 = new Date(this.messages[index - 1].timestamp).getTime() / (1000 * 3600 * 24);
    return Math.floor(d1) !== Math.floor(d2);
  }
}
