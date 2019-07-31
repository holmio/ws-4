/**
* Ionic Full App  (https://store.enappd.com/product/ionic-full-app-ionic-4-full-app)
*
* Copyright © 2019-present Enappd. All rights reserved.
*
* This source code is licensed as per the terms found in the
* LICENSE.md file in the root directory of this source tree.
*/
import { Injectable } from '@angular/core';
import { AngularFireStorage } from '@angular/fire/storage';

@Injectable({
    providedIn: 'root'
})
export class StorageService {
    constructor(private storage: AngularFireStorage) {
    }
    public uploadContent(file: any,fileName: any, fileRef: any): Promise<any> {
        return new Promise((resolve, reject) => {
            try {
              if (file) {
                return fileRef.putString(file, 'data_url', { contentType: 'image/jpeg' }).then(
                  success => {
                    return fileRef.getDownloadURL().subscribe(url => {
                        resolve(url);
                    });
                  },
                  failure => {
      
                    reject(failure);
                  }
                )
                  .catch(err => {
      
                    reject(err);
                  })
              } else {
                reject(new Error(' choice key not given'));
              }
            } catch (e) {
      
              reject(e);
            }
          })
    }
}
