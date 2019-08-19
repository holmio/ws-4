import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { APP_CONST } from 'src/app/util/app.constants';
import * as _ from 'lodash';
import { firestore } from 'firebase';
import { Chat, Message } from './chat.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatsCollectionRef: AngularFirestoreCollection<any>;

  constructor(
    private afStore: AngularFirestore,
  ) {
    this.chatsCollectionRef = this.afStore.collection<Chat>(APP_CONST.db.chats);
  }

  getChat(chatId: string): Observable<Chat> {
    return this.chatsCollectionRef.doc<Chat>(chatId).valueChanges();
  }

  create(data: Chat): Promise<any> {
    return this.chatsCollectionRef.add(data);
  }

  sendMessage(chatId: string, message: Message): Promise<any> {
    return this.chatsCollectionRef.doc(chatId).update({
      messages: firestore.FieldValue.arrayUnion(message)
    });
  }


}
