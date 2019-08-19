import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { APP_CONST } from 'src/app/util/app.constants';
import * as _ from 'lodash';
import { firestore } from 'firebase/app';
import { Chat, Message } from './chat.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatsCollectionRef: AngularFirestoreCollection<any>;
  private lisOfChatsCollectionRef: AngularFirestoreCollection<any>;

  constructor(
    private afStore: AngularFirestore,
  ) {
    this.chatsCollectionRef = this.afStore.collection<Chat>(APP_CONST.db.chats);
    this.lisOfChatsCollectionRef = this.afStore.collection<Chat>(APP_CONST.db.listChats);
  }

  getChat(chatId: string): Observable<Chat> {
    return this.chatsCollectionRef.doc<Chat>(chatId).valueChanges();
  }

  create(data: Chat): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const chatColl = this.afStore.firestore.doc(`${APP_CONST.db.chats}/${data.uid}`);
    const listChatsColl = this.afStore.firestore.doc(`${APP_CONST.db.listChats}/${data.uid}`);
    batch.set(chatColl, data)
    const messageDetail = {
      name: data.productName,
      uid: data.uid,
      timestamp: data.createdAt,
    }
    batch.set(listChatsColl, messageDetail)

    return batch.commit();

  }

  sendMessage(chatId: string, message: Message): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const chatColl = this.afStore.firestore.doc(`${APP_CONST.db.chats}/${chatId}`);
    const listChatsColl = this.afStore.firestore.doc(`${APP_CONST.db.listChats}/${chatId}`);
    const addMessage = { messages: firestore.FieldValue.arrayUnion(message) };
    
    batch.update(chatColl, addMessage)
    batch.update(listChatsColl, message)
    return batch.commit();
  }
}
