import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Product, ShortProduct } from './product.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, mergeMap } from 'rxjs/operators';
import { UserDetail, UserShortInfo } from '../user/user.interface';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productCollectionRef: AngularFirestoreCollection<any>;
  private productUserCollectionRef: AngularFirestoreCollection<any>;
  private userCollectionRef: AngularFirestoreCollection<any>;
  private userShortInfoCollectionRef: AngularFirestoreCollection<any>;
  private PRODUCTS = 'products';
  private PRODUCTS_BY_USER = 'productsByUser';
  private USERS = 'users';
  private USERS_SHORT_INFO = 'userShortInfo';

  constructor(
    private storage: AngularFireStorage,
    private afStore: AngularFirestore,
  ) {
    this.productCollectionRef = this.afStore.collection<Product>(this.PRODUCTS);
    this.productUserCollectionRef = this.afStore.collection<Product>(this.PRODUCTS_BY_USER);
    this.userShortInfoCollectionRef = this.afStore.collection<UserShortInfo>(this.USERS_SHORT_INFO);
    this.userCollectionRef = this.afStore.collection<UserDetail>(this.USERS);
  }

  getProduct(uid: string): Observable<any> {
    return this.productCollectionRef.doc(uid).valueChanges().pipe(
      mergeMap((product: Product) =>
        this.userShortInfoCollectionRef.doc(product.user.uid).valueChanges()
          .pipe(
            map(
              (user) => Object.assign({}, { ...product, user: user }
              )
            )
          )
      )
    )
  }

  getProducts(): Observable<any> {
    return this.productUserCollectionRef.valueChanges();
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
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${this.PRODUCTS}/${product.uid}`);
    const productShortColl = this.afStore.firestore.doc(`${this.PRODUCTS_BY_USER}/${product.uid}`);
    batch.set(productColl, product);
    batch.set(productShortColl, product);
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
    return new Promise((resolve, reject) => {
      batch.commit().then(() => resolve(product.uid), error => reject(error));
    });
  }

  addFavorite(uidUser: string, uidProduct: string): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${this.PRODUCTS}/${uidProduct}`);
    const productShortColl = this.afStore.firestore.doc(`${this.PRODUCTS_BY_USER}/${uidProduct}`);
    batch.update(productColl, { followers: firebase.firestore.FieldValue.arrayUnion(uidUser) });
    batch.update(productShortColl, { followers: firebase.firestore.FieldValue.arrayUnion(uidUser) });
    return batch.commit();
  }
  removeFavorite(uidUser: string, uidProduct: string): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${this.PRODUCTS}/${uidProduct}`);
    const productShortColl = this.afStore.firestore.doc(`${this.PRODUCTS_BY_USER}/${uidProduct}`);
    batch.update(productColl, { followers: firebase.firestore.FieldValue.arrayRemove(uidUser) });
    batch.update(productShortColl, { followers: firebase.firestore.FieldValue.arrayRemove(uidUser) });
    return batch.commit();
  }

  deleteProduct(uid: string) {
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${this.PRODUCTS}/${uid}`);
    const productShortColl = this.afStore.firestore.doc(`${this.PRODUCTS_BY_USER}/${uid}`);
    batch.delete(productColl);
    batch.delete(productShortColl);
    return batch.commit();
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