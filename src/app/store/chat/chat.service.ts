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

  create(data: Chat): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const chatColl = this.afStore.firestore.doc(`${APP_CONST.db.chats}/${data.uid}`);
    const chatsDetailColl = this.afStore.firestore.doc(`${APP_CONST.db.chatsDetail}/${data.uid}`);
    batch.set(chatColl, data);
    const messageDetail: ChatDetail = {
      uid: data.uid,
      productName: data.productName,
      timestamp: data.createdAt,
      message: 'Menssage por defecto',
      members: data.members
    };
    batch.set(chatsDetailColl, messageDetail);

    return batch.commit();

  }

  sendMessage(chatId: string, message: Message): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const chatColl = this.afStore.firestore.doc(`${APP_CONST.db.chats}/${chatId}`);
    const chatsDetailColl = this.afStore.firestore.doc(`${APP_CONST.db.chatsDetail}/${chatId}`);
    const addMessage = { messages: firestore.FieldValue.arrayUnion(message) };

    batch.update(chatColl, addMessage);
    batch.update(chatsDetailColl, message);
    return batch.commit();
  }
}
