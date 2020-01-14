import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore } from '@angular/fire/firestore';
import { Facebook } from '@ionic-native/facebook/ngx';
import { Platform } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { auth } from 'firebase/app';
import { Observable } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ToastService } from 'src/app/services/toast/toast.services';

import AuthProvider = firebase.auth.AuthProvider;


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(
    private afAuth: AngularFireAuth,
    private translate: TranslateService,
    private afStore: AngularFirestore,
    private fb: Facebook,
    private toast: ToastService,
    private platform: Platform,
  ) {
    this.user$ = this.afAuth.authState.pipe(
      map(user => user.uid)
    );
  }

  getUser() {
    return this.user$.pipe(first()).toPromise();
  }

  signInWithEmail(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

  createUserWithEmailAndPassword(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email, password);
  }

  resetPassword(email: string): Promise<any> {
    return new Promise((resolve, reject) => {
      this.resetPasswordFirebase(email).then(() => {
        resolve();
        this.toast.show({ message: this.translate.instant('auth.toast.reset-password.success') }); // Te hemos enviado el email para cambiar la contraseña
      }).catch((error) => {
        console.log(error);
        reject();
        if (error.code === 'auth/user-not-found') {
          this.toast.show({ message: this.translate.instant('auth.toast.reset-password.user-not-found'), color: 'danger' }); // Este email no existe
        } else {
          this.toast.show({ message: this.translate.instant('auth.toast.reset-password.email-not-sended'), color: 'danger' }); // No ha sido posible enviarte el email, intentalo mas tarde
        }
      });
    });
  }

  private resetPasswordFirebase(email: string): Promise<any> {
    const actionCodeSettings: firebase.auth.ActionCodeSettings = {
      url: 'https://marsa.page.link?page=reset-password?email=' + email,
      android: {
        packageName: 'com.saila.marsa',
        installApp: true,
        minimumVersion: '19',
      },
      dynamicLinkDomain: 'marsa.page.link',
      handleCodeInApp: true,
    };
    return this.afAuth.auth.sendPasswordResetEmail(email, actionCodeSettings);
  }

  confirmPassword(code: string, newPassword: string): Promise<any> {
    return this.afAuth.auth.confirmPasswordReset(code, newPassword);
  }

  signOut(): Promise<void> {
    return this.afAuth.auth.signOut();
  }

  async signInWithFacebook(): Promise<any> {
    if (this.platform.is('cordova')) {
      const sdkFacebook = await this.fb.login(['email']);
      const credentail = auth.FacebookAuthProvider.credential(sdkFacebook.authResponse.accessToken);
      return this.afAuth.auth.signInWithCredential(credentail);
    } else {
      return this.oauthSignIn(new auth.FacebookAuthProvider());
    }
  }
  private oauthSignIn(provider: AuthProvider): Promise<any> {
    return this.afAuth.auth.signInWithPopup(provider);
  }
}
