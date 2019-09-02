import { Observable, of } from 'rxjs';
import { firestore } from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { AngularFireStorage } from '@angular/fire/storage';
import { map, take } from 'rxjs/operators';
import { UserShortInfo } from '../user/user.interface';
import { StorageService } from 'src/app/services/firestore/filestorage.service';
import * as _ from 'lodash';
import { ToastService } from 'src/app/services/toast/toast.services';
import { APP_CONST } from 'src/app/util/app.constants';
import { Product } from '../product';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  private productCollectionRef: AngularFirestoreCollection<any>;
  private userShortInfoCollectionRef: AngularFirestoreCollection<any>;

  constructor(
    private storage: AngularFireStorage,
    private afStore: AngularFirestore,
    private storageService: StorageService,
    private toast: ToastService,
  ) {
    this.productCollectionRef = this.afStore.collection<Product>(APP_CONST.db.products);
    this.userShortInfoCollectionRef = this.afStore.collection<UserShortInfo>(APP_CONST.db.usersDetail);
  }

  getProducts(uidUser: string, name = ''): Observable<any> {
    console.log(name);
    if (name.length > 3) {
      return this.afStore.collection(APP_CONST.db.productsDetail, ref =>
        ref.orderBy('name').startAt(name).endAt(name + '\uf8ff')).valueChanges().pipe(
        map(actions => actions.filter((data: Product) => data.userUid !== uidUser),
        take(1))
      );
    }
    return of([]);
  }

}
