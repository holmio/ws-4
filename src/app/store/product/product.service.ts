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
    return this.productCollectionRef.doc(uid).valueChanges();
  }

  getProductShort(): Observable<ShortProduct[]> {
    return this.productUserCollectionRef.valueChanges();
  }

  updateProduct(product: Product): Promise<any> {
    const batch = this.afStore.firestore.batch();
    const productColl = this.afStore.firestore.doc('products/' + product.uid);
    const productShortColl = this.afStore.firestore.doc('productsUsers/' + product.uidUser + '_' + product.uid);
    batch.update(productColl, product);
    batch.update(productShortColl, product);
    return batch.commit();
  }

  setProduct(product: Product): Promise<any> {
    product.uid = this.uuidv4();
    return new Promise((resolve) => {
      this.productCollectionRef.doc(product.uid).set(product).then( () => {
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
        this.productUserCollectionRef.doc(product.uidUser + '_' + product.uid).set({
          name: product.name,
          price: product.price,
          currency: product.currency,
          thumbnail: '',
          isSold: product.isSold,
          isEnabled: product.isEnabled,
          uidUser: product.uidUser,
          uid: product.uid,
        }).finally(() => resolve(product.uid))
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

  private uuidv4() {
    return 'xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
      var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
      return v.toString(16);
    });
  }
}