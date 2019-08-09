import { User } from '../user/user.interface';
import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { Facebook } from '@ionic-native/facebook/ngx';
import { auth } from 'firebase/app';

import AuthProvider = firebase.auth.AuthProvider;
import { Platform } from '@ionic/angular';


@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: firebase.User;
  private userCollectionRef: AngularFirestoreCollection<any>;

	constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
    private fb: Facebook,
    private platform: Platform,
  ) {
    this.userCollectionRef = this.afStore.collection<User>('users');
  }

	signInWithEmail(email: string, password: string): Promise<any> {
    return this.afAuth.auth.signInWithEmailAndPassword(email, password);
  }

	createUserWithEmailAndPassword(email: string, password: string): Promise<any> {
    return this.afAuth.auth.createUserWithEmailAndPassword(email,password);
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