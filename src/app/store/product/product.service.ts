import { Observable, combineLatest } from 'rxjs';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Product, ShortProduct } from './product.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, switchMap, map } from 'rxjs/operators';
import { UserDetail } from '../user/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productCollectionRef: AngularFirestoreCollection<any>;
  private productUserCollectionRef: AngularFirestoreCollection<any>;
  private userCollectionRef: AngularFirestoreCollection<any>;
  private PRODUCTS = 'products';
  private PRODUCTS_BY_USER = 'productsByUser';

  constructor(
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private afStore: AngularFirestore,
  ) {
    this.productCollectionRef = this.afStore.collection<Product>(this.PRODUCTS);
    this.productUserCollectionRef = this.afStore.collection<Product>(this.PRODUCTS_BY_USER);
    this.userCollectionRef = this.afStore.collection<UserDetail>('users');

  }

  getProduct(uid: string): Observable<any> {
    return this.productCollectionRef.doc(uid).valueChanges()
  }

  getProducts(): Observable<any> {
    return this.productUserCollectionRef.valueChanges()
  }

  getProductsByUser(uid: string): Observable<any[]> {
    return this.userCollectionRef.doc(uid).collection(this.PRODUCTS_BY_USER).valueChanges();
  }

  updateProduct(product: Product): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${this.PRODUCTS}/${product.uid}`);
    const productShortColl = this.afStore.firestore.doc(`${this.PRODUCTS_BY_USER}/${product.uid}`);
    batch.update(productColl, product);
    batch.update(productShortColl, product);
    return batch.commit();
  }

  setProduct(product: Product): Promise<any> {
    product.uid = this.uuidv4();
    return new Promise((resolve) => {
      this.productCollectionRef.doc(product.uid).set(product).then(() => {
        const productsByUser = {
          name: product.name,
          price: product.price,
          currency: product.currency,
          thumbnail: '',
          isSold: product.isSold,
          isEnabled: product.isEnabled,
          uidUser: product.uidUser,
          uid: product.uid,
        };
        // Add gallery to the product
        // galleryList.forEach((image) => {
        //   const filePath = `${image.path}/gallery-${new Date().getTime()}.jpg`;
        //   this.uploadFileString(filePath, image.base64).then((downloadUrl) => {
        //     this.productCollectionRef.doc(data.uid).collection('gallery').add({
        //       path: filePath,
        //       downloadUrl: downloadUrl
        //     });
        //   });
        // })

        // Add product detail to user collection
        this.userCollectionRef.doc(product.uidUser).collection(this.PRODUCTS_BY_USER).doc(product.uid).set(productsByUser).then(() => {
          this.productUserCollectionRef.doc(product.uid).set(productsByUser).finally(() => resolve(product.uid));
        });
      });
    });
  }




  /**
   * Upload the files one by one
   * @param path path of the file
   * @param file base64 of file
   */
  private async uploadFileString(path: string, file: string) {
    const fileRef = this.storage.ref(path);
    const task = fileRef.putString(file);
    task.snapshotChanges().pipe(
      finalize(async () => await fileRef.getDownloadURL())
    );
  }

  private uuidv4() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}