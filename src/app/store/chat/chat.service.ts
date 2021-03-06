import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { APP_CONST } from 'src/app/util/app.constants';
import * as _ from 'lodash';
import { firestore } from 'firebase/app';
import { Chat, Message, Channel } from './chat.interface';
import { Observable } from 'rxjs';
import { take, mergeMap, map, tap } from 'rxjs/operators';
import { Product } from '../product';
import { UserShortInfo } from '../user';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  private chatsCollectionRef: AngularFirestoreCollection<any>;
  private channelsCollectionRef: AngularFirestoreCollection<any>;
  private productCollectionRef: AngularFirestoreCollection<Product>;
  private userShortInfoCollectionRef: AngularFirestoreCollection<any>;

  constructor(
    private afStore: AngularFirestore,
  ) {
    this.chatsCollectionRef = this.afStore.collection<Chat>(APP_CONST.db.chats);
    this.channelsCollectionRef = this.afStore.collection<Channel>(APP_CONST.db.channels);
    this.productCollectionRef = this.afStore.collection<Product>(APP_CONST.db.productsDetail);
    this.userShortInfoCollectionRef = this.afStore.collection<UserShortInfo>(APP_CONST.db.usersDetail);
  }

  getChat(uid: string): Observable<Chat> {
    return this.chatsCollectionRef.doc<Chat>(uid).valueChanges();
  }


  getChannels(uid: string): Observable<Channel[]> {
    return this.afStore.collection<Channel>(APP_CONST.db.channels, ref =>
      ref.where(`members.${uid}`, '==', true)
    ).valueChanges();
  }

  getChannel(uid: string): Observable<Channel> {
    return this.channelsCollectionRef.doc<Channel>(uid).valueChanges().pipe(take(1));
  }

  updateChannel(channel: Channel, isVisitor: boolean): Observable<any> {
    return this.productCollectionRef.doc(channel.product.uid).valueChanges().pipe(
      mergeMap((product: Product) =>
        this.userShortInfoCollectionRef.doc(
          isVisitor ? channel.owner.uid : channel.visitor.uid
        ).valueChanges()
          .pipe(
            map(
              (user: UserShortInfo) => Object.assign({}, { product, user })
            ),
            tap((data) => {
              const newData = this.compareData(data, channel, isVisitor);
              if (newData) {
                this.channelsCollectionRef.doc<Channel>(channel.uid).update(newData);
              }
            }),
            take(1)
          )
      ),
      take(1)
    );
  }

  private compareData(newData: { product: Product; user: UserShortInfo; }, oldData: Channel, isVisitor: boolean) {
    const newUserInfo: UserShortInfo = {
      avatar: newData.user.avatar,
      lastConnection: newData.user.lastConnection,
      name: newData.user.name,
      uid: newData.user.uid,
    };
    const newProductInfo = {
      avatar: newData.product.avatar,
      name: newData.product.name,
    };

    let dataToUpdate: Partial<Channel>;
    if (isVisitor) {
      dataToUpdate = _.cloneDeep(this.difference(newUserInfo, oldData.owner, 'owner'));
    } else {
      dataToUpdate = _.cloneDeep(this.difference(newUserInfo, oldData.visitor, 'visitor'));
    }
    if (!_.isEqual(newProductInfo, oldData.product)) {
      dataToUpdate = _.assign({}, dataToUpdate, this.difference(newProductInfo, oldData.product, 'product'));
    }

    if (!_.isEmpty(dataToUpdate)) {
      return { ...dataToUpdate };
    }

    return;
  }


  private difference(newData, oldData, parentObj: string) {
    function changes(newData, oldData) {
      return _.transform(newData, (result, value, key) => {
        if (!_.isEqual(value, oldData[key])) {
          result[parentObj + '.' + key] = (_.isObject(value) && _.isObject(oldData[key])) ? changes(value, oldData[key]) : value;
        }
      });
    }
    return changes(newData, oldData);
  }

  createChannel(chat: Chat, newChannel: Channel): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const chatColl = this.afStore.firestore.doc(`${APP_CONST.db.chats}/${newChannel.uid}`);
    const channelColl = this.afStore.firestore.doc(`${APP_CONST.db.channels}/${newChannel.uid}`);
    batch.set(chatColl, chat);
    batch.set(channelColl, newChannel);
    return batch.commit();
  }

  sendMessage(uid: string, message: Message): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const chatColl = this.afStore.firestore.doc(`${APP_CONST.db.chats}/${uid}`);
    const channelColl = this.afStore.firestore.doc(`${APP_CONST.db.channels}/${uid}`);
    const addMessage = { messages: firestore.FieldValue.arrayUnion(message) };
    batch.update(chatColl, addMessage);
    batch.update(channelColl, { lastMessage: message.message, timestamp: message.timestamp });
    return batch.commit();
  }
}
