import { Observable } from 'rxjs';
import * as firebase from 'firebase/app';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Product } from './product.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { map, mergeMap, take, first } from 'rxjs/operators';
import { UserShortInfo } from '../user/user.interface';
import { StorageService } from 'src/app/services/firestore/filestorage.service';
import * as _ from 'lodash';
import { isUrl } from 'src/app/util/common';
import { ToastService } from 'src/app/services/toast/toast.services';
import { APP_CONST } from 'src/app/util/app.constants';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productCollectionRef: AngularFirestoreCollection<any>;
  private userShortInfoCollectionRef: AngularFirestoreCollection<any>;

  constructor(
    private storage: AngularFireStorage,
    private afStore: AngularFirestore,
    private storageService: StorageService,
    private toast: ToastService,
  ) {
    this.productCollectionRef = this.afStore.collection<Product>(APP_CONST.db.products);
    this.userShortInfoCollectionRef = this.afStore.collection<UserShortInfo>(APP_CONST.db.users_detail);
  }

  getProduct(uid: string): Observable<any> {
    return this.productCollectionRef.doc(uid).valueChanges().pipe(
      mergeMap((product: Product) =>
        this.userShortInfoCollectionRef.doc(product.user.uid).valueChanges()
          .pipe(
            map(
              (user) => Object.assign({}, { ...product, user: user })
            )
          )
      ),
    );
  }

  getProducts(uidUser = ''): Observable<any> {
    return this.afStore.collection(APP_CONST.db.products_detail, ref => ref.orderBy('timestamp', 'desc')).valueChanges().pipe(
      map(actions => actions.filter((data: Product) => data.user.uid !== uidUser))
    );
  }

  async updateProduct(product: Product, imagesToDelete: string[]): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${APP_CONST.db.products}/${product.uid}`);
    const productShortColl = this.afStore.firestore.doc(`${APP_CONST.db.products_detail}/${product.uid}`);
    const favoriteProductsColl = this.afStore.firestore.doc(`${APP_CONST.db.favorite_products}/${product.uid}`);
    // Delete file from firestorage
    await this.deleteGallery(imagesToDelete);
    // Upload gallery to firestorage and firestore the url
    product.gallery = await this.uploadGallery(product.gallery, product.uid);
    product.thumbnail = product.gallery[0] || '';
    batch.update(productColl, product);
    // Delete unnecessary information
    delete product.followers;
    delete product.gallery;
    delete product.description;
    delete product.creationDate;
    batch.update(productShortColl, product);
    delete product.category;
    delete product.user;
    batch.update(favoriteProductsColl, product);
    return batch.commit();
  }

  async setProduct(product: Product): Promise<any> {
    product.uid = this.uuidv4();
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${APP_CONST.db.products}/${product.uid}`);
    const productShortColl = this.afStore.firestore.doc(`${APP_CONST.db.products_detail}/${product.uid}`);
    const favoriteProductsColl = this.afStore.firestore.doc(`${APP_CONST.db.favorite_products}/${product.uid}`);
    // Add gallery to the product
    product.gallery = await this.uploadGallery(product.gallery, product.uid);
    product.thumbnail = product.gallery[0] || '';
    batch.set(productColl, product);
    // Delete unnecessary information
    delete product.followers;
    delete product.gallery;
    delete product.description;
    delete product.creationDate;
    batch.set(productShortColl, product);
    delete product.category;
    delete product.user;
    batch.set(favoriteProductsColl, product);
    return new Promise((resolve, reject) => {
      batch.commit().then(() => resolve(product.uid), error => reject(error));
    });
  }

  addFavorite(uidUser: string, uidProduct: string): Promise<any> {
    const favoriteProductsColl = this.afStore.firestore.doc(`${APP_CONST.db.favorite_products}/${uidProduct}`);
    return favoriteProductsColl.update({ followers: firebase.firestore.FieldValue.arrayUnion(uidUser) });
  }
  removeFavorite(uidUser: string, uidProduct: string): Promise<any> {
    const favoriteProductsColl = this.afStore.firestore.doc(`${APP_CONST.db.favorite_products}/${uidProduct}`);
    return favoriteProductsColl.update({ followers: firebase.firestore.FieldValue.arrayRemove(uidUser) });
  }

  async deleteProduct(product: Product) {
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${APP_CONST.db.products}/${product.uid}`);
    const productShortColl = this.afStore.firestore.doc(`${APP_CONST.db.products_detail}/${product.uid}`);
    const favoriteProductsColl = this.afStore.firestore.doc(`${APP_CONST.db.favorite_products}/${product.uid}`);
    batch.delete(productColl);
    batch.delete(productShortColl);
    batch.delete(favoriteProductsColl);
    await this.deleteGallery(product.gallery)
    return batch.commit();
  }

  private async uploadGallery(gallery: string[], productUid: string): Promise<any> {
    let galleryUploaded: string[] = [];
    let count = 0;
    for (const value of gallery) {
      if (!isUrl(value)) {
        const filePath: string = `gallery/${productUid}_${count}.jpg`;
        const fileRef = this.storage.ref(filePath);
        try {
          const file = await this.storageService.uploadContent(value, filePath, fileRef)
          galleryUploaded.push(file);
        } catch (error) {
          this.toast.show(`No se ha podido subir la imagen ${error}`, 'warning', '', 5000)
        }
      } else {
        galleryUploaded.push(value);
      }
      count++;
    }
    return galleryUploaded;
  }

  private async deleteGallery(gallery: string[]): Promise<any> {
    for (const url of gallery) {
      const fileRef = await this.storage.storage.refFromURL(url);
      try {
        await fileRef.delete();
      } catch (error) {
        this.toast.show(`Algo fue mal eliminando la imagen ${error}`, 'warning', '', 5000)
      }
    }
  }

  private uuidv4() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}