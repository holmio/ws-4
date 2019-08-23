import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { APP_CONST } from 'src/app/util/app.constants';
import * as _ from 'lodash';
import { firestore } from 'firebase/app';
import { Chat, Message, ChatDetail } from './chat.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatsCollectionRef: AngularFirestoreCollection<any>;
  private chatsDetailCollectionRef: AngularFirestoreCollection<any>;

  constructor(
    private afStore: AngularFirestore,
  ) {
    this.chatsCollectionRef = this.afStore.collection<Chat>(APP_CONST.db.chats);
  }

  getChat(chatId: string): Observable<Chat> {
    return this.chatsCollectionRef.doc<Chat>(chatId).valueChanges();
  }

  getChatsDetail(uid: string) {
    return this.afStore.collection<ChatDetail>(APP_CONST.db.chatsDetail, ref =>
      ref.where(`members.${uid}`, '==', true)
    ).valueChanges();
  }

  create(chat: Chat, chatDetail: ChatDetail): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const chatColl = this.afStore.firestore.doc(`${APP_CONST.db.chats}/${chat.uid}`);
    const chatsDetailColl = this.afStore.firestore.doc(`${APP_CONST.db.chatsDetail}/${chat.uid}`);
    batch.set(chatColl, chat);
    batch.set(chatsDetailColl, chatDetail);

    return batch.commit();
  }

  sendMessage(chatId: string, message: Message): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const chatColl = this.afStore.firestore.doc(`${APP_CONST.db.chats}/${chatId}`);
    const chatsDetailColl = this.afStore.firestore.doc(`${APP_CONST.db.chatsDetail}/${chatId}`);
    const addMessage = { messages: firestore.FieldValue.arrayUnion(message) };
    
    batch.update(chatColl, addMessage);
    message.uid = chatId;
    batch.update(chatsDetailColl, message);
    return batch.commit();
  }
}
