import {
  Component,
  OnDestroy,
  OnInit,
  ViewChild
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import {
  Actions,
  ofActionDispatched,
  Select,
  Store
} from '@ngxs/store';
import * as _ from 'lodash';
import * as moment from 'moment';
import { Observable, Subject } from 'rxjs';
import { filter, take, takeUntil } from 'rxjs/operators';
import { AuthState } from 'src/app/store/auth';
import {
  Channel,
  ChatState,
  GetChannelAction,
  GetChannelFailedAction,
  GetChannelSuccessAction,
  Message,
  SendMessageAction,
  SetChannelAction,
  UpdateChannelAction,
  DistroyChatAction
} from 'src/app/store/chat';
import { ChatService } from 'src/app/store/chat/chat.service';

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

    this.messages$.pipe(
      filter((data) => !!data),
      take(1)
    ).subscribe(() => this.scrollDown());

    this.messages$.pipe(takeUntil(this.distroy$)).subscribe((messages: Message[]) => {
      this.messages = _.cloneDeep(messages);
    });
  }

  ngOnDestroy(): void {
    this.store.dispatch(new DistroyChatAction());
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

  focusFunction(event: any) {
    this.show = false;
    console.log(event);
  }
  diffDates(index) {
    if (index === 0) {
      return true;
    }
    // To calculate the time difference of two dates
    const d1 = new Date(this.messages[index].timestamp).getTime() / (1000 * 3600 * 24);
    const d2 = new Date(this.messages[index - 1].timestamp).getTime() / (1000 * 3600 * 24);
    return Math.floor(d1) !== Math.floor(d2);
  }
}
