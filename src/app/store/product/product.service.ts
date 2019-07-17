import { Observable } from 'rxjs';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Product } from './product.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productCollectionRef: AngularFirestoreCollection<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
  ) {
    this.productCollectionRef = this.afStore.collection<Product>('products');
  }

  getProduct(uid: string): Observable<any> {
    return this.productCollectionRef.doc(uid).valueChanges();
  }

}
