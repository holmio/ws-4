import { Component, OnInit, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IonContent } from '@ionic/angular';
import { Store, Select } from '@ngxs/store';
import { GetChatAction, ChatState, Chat, SendMessageAction } from 'src/app/store/chat';
import { Observable } from 'rxjs';
import { AuthState } from 'src/app/store/auth';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.page.html',
  styleUrls: ['./chat.page.scss'],
})
export class ChatPage implements OnInit {
  @ViewChild('IonContent') content: IonContent

  id: string;
  @Select(ChatState.getChat) chat$: Observable<Chat>;
  @Select(AuthState.getUid) uid$: Observable<string | undefined>;
  

  data: {}[];

  paramData: any;
  userName: any;
  user_input: string = '';
  User: string = 'Me';
  toUser: string = 'HealthBot';
  start_typing: any;
  loader: boolean;
  show: boolean;
  footerJson: { 'icon': string; 'label': string; }[];

  constructor(
    private store: Store,
    private activRoute: ActivatedRoute
  ) {
    this.id = this.activRoute.snapshot.params.id;
    this.store.dispatch(new GetChatAction(this.id));
    console.log(this.id);
  }

  ngOnInit() {
  }

  toggleList() {
    this.show = !this.show
    console.log(this.show);
    this.scrollDown();
  }

  sendMsg() {
    if (this.user_input !== '') {

      this.store.dispatch(new SendMessageAction(this.user_input));      
  
      this.user_input = '';
      this.scrollDown()
      
    }
    this.show = false
  }
  
  scrollDown() {
    setTimeout(() => {
      this.content.scrollToBottom(50)
    }, 200);
  }
  something($event: any) {
    $event.preventDefault()
    console.log($event)
  }
  userTyping(event: any) {
    this.show = false
    console.log(event);
    this.start_typing = event.target.value;
    this.scrollDown()
  }
  focusFunction(event: any) {
    this.show = false
    console.log(event)
  }
}
