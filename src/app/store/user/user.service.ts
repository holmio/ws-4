import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { User, UserShortInfo } from './user.interface';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, mergeMap, map } from 'rxjs/operators';
import { ShortProduct, Product } from '../product';
import { StorageService } from 'src/app/services/firestore/filestorage.service';

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
    private storage: AngularFireStorage,
    private storageService: StorageService
  ) {
    this.userCollectionRef = this.afStore.collection<User>(this.USERS);
    this.userShortInfoCollectionRef = this.afStore.collection<UserShortInfo>(this.USERS_SHORT_INFO);
  }

  getUser(uid: string): Observable<any> {
    return this.userCollectionRef.doc(uid).valueChanges().pipe(
      mergeMap((user) =>
        // Get my products
        this.afStore.collection(this.PRODUCTS_BY_USER, ref => ref.where('user.uid', '==', uid)).valueChanges().pipe(
          mergeMap((products) =>
            // Get my favorite products
            this.afStore.collection(this.PRODUCTS_BY_USER, ref => ref.where('followers', 'array-contains', uid)).valueChanges().pipe(
              map(
                (favorites) => Object.assign({}, { ...user, myProducts: [...products], favorites: [...favorites] })
              )
            )
          )
        )
      )
    );
  }

  setUser(uid: string, userInformation: User): Promise<any> {
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

  updateUser(uid: string, user: User): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const usersColl = this.afStore.firestore.doc(`${this.USERS}/${uid}`);
    const usertShortColl = this.afStore.firestore.doc(`${this.USERS_SHORT_INFO}/${uid}`);
    batch.update(usersColl, user);
    batch.update(usertShortColl, user);
    return batch.commit();
  }

  async updateAvatar(file: string, uid: string): Promise<any> {
    const filePath: string = `avatar/${uid}.jpg`;
    const fileRef = this.storage.ref(filePath);
    const usersColl = this.afStore.firestore.doc(`${this.USERS}/${uid}`);
    return this.storageService.uploadContent(file, filePath, fileRef).then(async (url) => {
      await usersColl.update({ avatar: url })
    })
  }

}
