import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserDetail, UserUpdate, AvatarUpdate, UserShortInfo } from './user.interface';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, mergeMap, map } from 'rxjs/operators';
import { ShortProduct } from '../product';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollectionRef: AngularFirestoreCollection<any>;
  private userShortInfoCollectionRef: AngularFirestoreCollection<any>;
  private PRODUCTS_BY_USER = 'productsByUser';
  private USERS = 'users';
  private USERS_SHORT_INFO = 'userShortInfo';

  constructor(
    private afStore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.userCollectionRef = this.afStore.collection<UserDetail>(this.USERS);
    this.userShortInfoCollectionRef = this.afStore.collection<UserShortInfo>(this.USERS_SHORT_INFO);
  }

  getUser(uid: string): Observable<any> {
    return this.userCollectionRef.doc(uid).valueChanges().pipe(
      mergeMap((user: UserDetail) =>
        this.afStore.collection<UserShortInfo>(this.PRODUCTS_BY_USER, ref => ref.where('user.uid', '==', uid)).valueChanges()
          .pipe(
            map(
              (products) => Object.assign({}, { ...user, myProducts: [...products] })
            )
          )
      )
    )
  }

  setUser(uid: string, userInformation: UserDetail): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const usersColl = this.afStore.firestore.doc(`${this.USERS}/${uid}`);
    const usertShortColl = this.afStore.firestore.doc(`${this.USERS_SHORT_INFO}/${uid}`);
    batch.set(usersColl, userInformation);
    const userShortInfo: UserShortInfo = {
      avatar: userInformation.avatar,
      name: userInformation.name,
      uid: userInformation.uid,
    };
    batch.set(usertShortColl, userShortInfo);
    return batch.commit();
  }

  updateUser(uid: string, user: UserUpdate): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const usersColl = this.afStore.firestore.doc(`${this.USERS}/${uid}`);
    const usertShortColl = this.afStore.firestore.doc(`${this.USERS_SHORT_INFO}/${uid}`);
    batch.update(usersColl, user);
    batch.update(usertShortColl, user);
    return batch.commit();
  }

  updateAvatar(avatar: AvatarUpdate): Observable<any> {
    const fileRef = this.storage.ref(avatar.path);
    let downloadUrl: Promise<any>;
    return this.storage.upload(avatar.path, avatar.base64image).snapshotChanges().pipe(
      finalize(async () => {
        downloadUrl = await fileRef.getDownloadURL().toPromise();
      })
    );
  }

}
