import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserDetail, UserUpdate, AvatarUpdate } from './user.interface';
import { Observable } from 'rxjs';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, mergeMap, map } from 'rxjs/operators';
import { ShortProduct } from '../product';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private userCollectionRef: AngularFirestoreCollection<any>;
  private PRODUCTS_BY_USER = 'productsByUser';

  constructor(
    private afStore: AngularFirestore,
    private storage: AngularFireStorage
  ) {
    this.userCollectionRef = this.afStore.collection<UserDetail>('users');
  }

  getUser(uid: string): Observable<any> {
    return this.userCollectionRef.doc(uid).valueChanges().pipe(
      mergeMap((user: UserDetail) =>
        this.userCollectionRef.doc(uid).collection(this.PRODUCTS_BY_USER).valueChanges()
          .pipe(
            map(
              (products) => Object.assign({}, { ...user, myProducts: [...products] }
            )
          )
        )
      )
    )
  }

  setUser(uid: string, userInformation: UserDetail): Promise<any> {
    return this.userCollectionRef.doc(uid).set(userInformation);
  }

  updateUser(uid: string, user: UserUpdate): Promise<any> {
    return this.userCollectionRef.doc(uid).update(user);
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
