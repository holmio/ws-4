import { Product } from './product.interface';
import { UserShortInfo } from '../user/user.interface';
import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { AngularFireStorage } from '@angular/fire/storage';
import { firestore } from 'firebase/app';
import * as _ from 'lodash';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { StorageService } from 'src/app/services/firestore/filestorage.service';
import { ToastService } from 'src/app/services/toast/toast.services';
import { APP_CONST } from 'src/app/util/app.constants';
import { isUrl } from 'src/app/util/common';


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
    this.userShortInfoCollectionRef = this.afStore.collection<UserShortInfo>(APP_CONST.db.usersDetail);
  }

  getProduct(uid: string): Observable<any> {
    return this.productCollectionRef.doc(uid).valueChanges();
  }

  getProducts(uidUser = ''): Observable<any> {
    return this.afStore.collection(APP_CONST.db.productsDetail, ref => ref.orderBy('timestamp', 'desc')).valueChanges().pipe(
      map(actions => actions.filter((data: Product) => data.userUid !== uidUser))
    );
  }

  getMyProducts(uidUser: string): Observable<any> {
    return this.afStore.collection(APP_CONST.db.productsDetail, ref => ref.where('userUid', '==', uidUser)).valueChanges();
  }

  getFavorites(uidUser: string): Observable<any> {
    return this.afStore.collection(APP_CONST.db.favoriteProducts, ref => ref.where('followers', 'array-contains', uidUser)).valueChanges();
  }

  async updateProduct(product: Product, imagesToDelete: string[]): Promise<any> {
    try {
      if (imagesToDelete.length > 0) {
        await this.deleteGallery(imagesToDelete);
      }
    } catch (error) {
      return;
    }
    const batch = await this.handelProductData(product, 'update');
    return batch.commit();
  }

  async setProduct(product: Product): Promise<any> {
    product.uid = this.uuidv4();
    const batch = await this.handelProductData(product, 'set');
    return new Promise((resolve, reject) => {
      batch.commit().then(() => resolve(product.uid), error => reject(error));
    });
  }

  private async handelProductData(product: Product, action: 'set' | 'update') {
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${APP_CONST.db.products}/${product.uid}`);
    const productShortColl = this.afStore.firestore.doc(`${APP_CONST.db.productsDetail}/${product.uid}`);
    const favoriteProductsColl = this.afStore.firestore.doc(`${APP_CONST.db.favoriteProducts}/${product.uid}`);
    // Add gallery to the product
    product.gallery = await this.uploadGallery(product.gallery, product.uid);
    product.avatar = product.gallery[0] || '';
    if (action === 'set') {
      batch.set(productColl, product);
    } else {
      batch.update(productColl, product);
    }
    // Delete unnecessary information
    delete product.followers;
    delete product.gallery;
    delete product.description;
    delete product.createdAt;
    if (action === 'set') {
      batch.set(productShortColl, product);
    } else {
      batch.update(productShortColl, product);
    }
    delete product.category;
    delete product.userUid;
    delete product.willaya;
    delete product.daira;
    delete product.timestamp;
    if (action === 'set') {
      batch.set(favoriteProductsColl, product);
    } else {
      batch.update(favoriteProductsColl, product);
    }
    return batch;
  }

  addFavorite(uidUser: string, uidProduct: string): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${APP_CONST.db.products}/${uidProduct}`);
    const favoriteProductsColl = this.afStore.firestore.doc(`${APP_CONST.db.favoriteProducts}/${uidProduct}`);
    const addFollower = { followers: firestore.FieldValue.arrayUnion(uidUser) };
    batch.update(productColl, addFollower);
    batch.update(favoriteProductsColl, addFollower);
    return batch.commit();
  }
  removeFavorite(uidUser: string, uidProduct: string): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${APP_CONST.db.products}/${uidProduct}`);
    const favoriteProductsColl = this.afStore.firestore.doc(`${APP_CONST.db.favoriteProducts}/${uidProduct}`);
    const addFollower = { followers: firestore.FieldValue.arrayRemove(uidUser) };
    batch.update(productColl, addFollower);
    batch.update(favoriteProductsColl, addFollower);
    return batch.commit();
  }

  async deleteProduct(product: Product) {
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc(`${APP_CONST.db.products}/${product.uid}`);
    const productShortColl = this.afStore.firestore.doc(`${APP_CONST.db.productsDetail}/${product.uid}`);
    const favoriteProductsColl = this.afStore.firestore.doc(`${APP_CONST.db.favoriteProducts}/${product.uid}`);
    batch.delete(productColl);
    batch.delete(productShortColl);
    batch.delete(favoriteProductsColl);
    await this.deleteGallery(product.gallery);
    return batch.commit();
  }

  private async uploadGallery(gallery: string[], productUid: string): Promise<any> {
    const galleryUploaded: string[] = [];
    let count = 0;
    for (const value of gallery) {
      if (!isUrl(value)) {
        const filePath = `gallery/${this.uuidv4()}.jpg`;
        const fileRef = this.storage.ref(filePath);
        try {
          const file = await this.storageService.uploadContent(value, filePath, fileRef);
          galleryUploaded.push(file);
        } catch (error) {
          this.toast.show({ message: `No se ha podido subir la imagen ${error}`, color: 'warning', duration: 5000 });
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
        this.toast.show({ message: `Algo fue mal eliminando la imagen ${error}`, color: 'warning', duration: 5000 });
      }
    }
  }

  private uuidv4() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // tslint:disable-next-line: no-bitwise
      const r = Math.random() * 16 | 0, v = c === 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}
