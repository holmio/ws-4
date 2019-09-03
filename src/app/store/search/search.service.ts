import { Filter } from './search.interface';
import { Product } from '../product';
import { UserShortInfo } from '../user/user.interface';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { firestore } from 'firebase/app';
import * as _ from 'lodash';
import { Observable, of } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StorageService } from 'src/app/services/firestore/filestorage.service';
import { ToastService } from 'src/app/services/toast/toast.services';
import { APP_CONST } from 'src/app/util/app.constants';


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

  getProducts(uidUser: string, filter: Filter): Observable<any> {
    if ((filter.name && filter.name.length > 3) || filter.category) {
      return this.afStore.collection(APP_CONST.db.productsDetail, ref => {
        let query: any = ref;
        if (filter.name) {
          query = ref.orderBy('name').startAt(filter.name).endAt(filter.name + '\uf8ff');
        }
        if (filter.category) {
          query = ref.where('category', '==', filter.category);
        }
        return query;
      }
      ).valueChanges().pipe(
        map(actions => actions.filter((data: Product) => data.userUid !== uidUser),
          take(1))
      );
    }
    return of([]);
  }

}
