import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Product, ShortProduct } from './product.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, map, mergeMap, take } from 'rxjs/operators';
import { User, UserShortInfo } from '../user/user.interface';
import { StorageService } from 'src/app/services/firestore/filestorage.service';

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
    private storageService: StorageService,
  ) {
    this.productCollectionRef = this.afStore.collection<Product>(this.PRODUCTS);
    this.productUserCollectionRef = this.afStore.collection<Product>(this.PRODUCTS_BY_USER);
    this.userShortInfoCollectionRef = this.afStore.collection<UserShortInfo>(this.USERS_SHORT_INFO);
    this.userCollectionRef = this.afStore.collection<User>(this.USERS);
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
    return this.productUserCollectionRef.valueChanges().pipe(take(1));
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

  async setProduct(product: Product): Promise<any> {
    product.uid = this.uuidv4();
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${this.PRODUCTS}/${product.uid}`);
    const productShortColl = this.afStore.firestore.doc(`${this.PRODUCTS_BY_USER}/${product.uid}`);
    // Add gallery to the product
    product.gallery = await this.uploadGallery(product.gallery, product.uid);
    product.thumbnail = product.gallery[0];
    batch.set(productColl, product);
    batch.set(productShortColl, product);
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

  async deleteProduct(product: Product) {
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${this.PRODUCTS}/${product.uid}`);
    const productShortColl = this.afStore.firestore.doc(`${this.PRODUCTS_BY_USER}/${product.uid}`);
    batch.delete(productColl);
    batch.delete(productShortColl);
    await this.deleteGallery(product.gallery)
    return batch.commit();
  }

  async uploadGallery(gallery: string[], productUid: string): Promise<any> {
    let galleryUploaded: string[] = [];
    let count = 0;
    for (const value of gallery) {
      const filePath: string = `gallery/${productUid}_${count}.jpg`;
      const fileRef = this.storage.ref(filePath);
      const file = await this.storageService.uploadContent(value, filePath, fileRef)
      galleryUploaded.push(file);
      count++;
    }
    return galleryUploaded;
  }

  async deleteGallery(gallery: string[]): Promise<any> {
    for (const url of gallery) {
      const fileRef = await this.storage.storage.refFromURL(url);
      await fileRef.delete();
    }
  }



  private uuidv4() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}