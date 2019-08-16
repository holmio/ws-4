import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User, UserShortInfo } from './user.interface';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { mergeMap, map } from 'rxjs/operators';
import { StorageService } from 'src/app/services/firestore/filestorage.service';
import { APP_CONST } from 'src/app/util/app.constants';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollectionRef: AngularFirestoreCollection<any>;
  private userShortInfoCollectionRef: AngularFirestoreCollection<any>;

  constructor(
    private afStore: AngularFirestore,
    private storage: AngularFireStorage,
    private storageService: StorageService
  ) {
    this.userCollectionRef = this.afStore.collection<User>(APP_CONST.db.users);
    this.userShortInfoCollectionRef = this.afStore.collection<UserShortInfo>(APP_CONST.db.usersDetail);
  }

  getUser(uid: string): Observable<any> {
    return this.userCollectionRef.doc(uid).valueChanges();
  }

  getShortUser(uid: string): Observable<any> {
    return this.userShortInfoCollectionRef.doc(uid).valueChanges();
  }

  setUser(uid: string, userInformation: User): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const usersColl = this.afStore.firestore.doc(`${APP_CONST.db.users}/${uid}`);
    const usertShortColl = this.afStore.firestore.doc(`${APP_CONST.db.usersDetail}/${uid}`);
    batch.set(usersColl, userInformation);
    const userShortInfo: UserShortInfo = {
      avatar: userInformation.avatar,
      name: userInformation.name,
      uid: userInformation.uid,
    };
    batch.set(usertShortColl, userShortInfo);
    return batch.commit();
  }

  updateUser(uid: string, user: User): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const usersColl = this.afStore.firestore.doc(`${APP_CONST.db.users}/${uid}`);
    const usertShortColl = this.afStore.firestore.doc(`${APP_CONST.db.usersDetail}/${uid}`);
    batch.update(usersColl, user);
    batch.update(usertShortColl, user);
    return batch.commit();
  }

  async updateAvatar(file: string, uid: string): Promise<any> {
    const filePath: string = `avatar/${uid}.jpg`;
    const fileRef = this.storage.ref(filePath);
    const usersColl = this.afStore.firestore.doc(`${APP_CONST.db.users}/${uid}`);
    return this.storageService.uploadContent(file, filePath, fileRef).then(async (url) => {
      await usersColl.update({ avatar: url })
    })
  }

}
