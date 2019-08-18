import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { mergeMap, map } from 'rxjs/operators';
import { StorageService } from 'src/app/services/firestore/filestorage.service';
import { APP_CONST } from 'src/app/util/app.constants';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatCollectionRef: AngularFirestoreCollection<any>;

  constructor(
    private afStore: AngularFirestore,
    private storage: AngularFireStorage,
    private storageService: StorageService
  ) {
    this.chatCollectionRef = this.afStore.collection<any>(APP_CONST.db.chats);
  }

  get(chatId) {
    return this.afStore
      .collection<any>('chats')
      .doc(chatId)
      .snapshotChanges()
      .pipe(
        map(doc => {
          return { id: doc.payload.id, ...doc.payload.data() };
        })
      );
  }

  async create() {
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      createdAt: Date.now(),
      count: 0,
      messages: []
    };

    return this.chatCollectionRef.add(data);
  }

  async sendMessage(chatId, content) {
    const { uid } = await this.auth.getUser();

    const data = {
      uid,
      content,
      createdAt: Date.now()
    };

    if (uid) {
      const ref = this.afs.collection('chats').doc(chatId);
      return ref.update({
        messages: firestore.FieldValue.arrayUnion(data)
      });
    }
  }


}
