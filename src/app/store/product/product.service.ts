import { Observable, combineLatest } from 'rxjs';

import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';

import { Product, ShortProduct } from './product.interface';
import { AngularFireStorage } from '@angular/fire/storage';
import { finalize, switchMap, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private productCollectionRef: AngularFirestoreCollection<any>;
  private productUserCollectionRef: AngularFirestoreCollection<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private storage: AngularFireStorage,
    private afStore: AngularFirestore,
  ) {
    this.productCollectionRef = this.afStore.collection<Product>('products');
    this.productUserCollectionRef = this.afStore.collection<Product>('productsUsers');
  }

  getProduct(uid: string): Observable<any> {
    return this.productCollectionRef.doc(uid).valueChanges()
  }

  getProductShort(): Observable<ShortProduct[]> {
    return this.productUserCollectionRef.valueChanges();
  }

  updateProduct(product: Product): Promise<any> {
    const batch = this.afStore.firestore.batch(); 
    const productColl = this.afStore.firestore.doc('products/' + product.uid);
    batch.update(productColl, product);
    // Update short information of product
    if (this.getShortProductToUpdate(product)) {
      const productShortColl = this.afStore.firestore.doc('productsUsers/' + product.uidUser + '_' + product.uid);
      batch.update(productShortColl, this.getShortProductToUpdate(product));
    }
    return batch.commit();
  }

  private getShortProductToUpdate(product: Product): ShortProduct {
    const producShortKeys = ['currency', 'isEnabled', 'isSold', 'name', 'price', 'thumbnail'];
    let productShort: ShortProduct;
    producShortKeys.forEach(key => {
      if (product.hasOwnProperty(key)) {
        productShort = <any>Object.assign({ [key]: product[key] }, {});
      }
    })
    return productShort;
  }

  setProduct(product: Product): Promise<any> {
    return new Promise((resolve) => {
      this.productCollectionRef.add(product).then( data => {
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
        this.productUserCollectionRef.doc(product.uidUser + '_' + data.id).set({
          name: product.name,
          price: product.price,
          currency: product.currency,
          thumbnail: '',
          isSold: product.isSold,
          isEnabled: product.isEnabled,
          uidUser: product.uidUser,
          uid: data.id,
        }).finally(() => resolve(data.id))
      });
    }) 
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
}