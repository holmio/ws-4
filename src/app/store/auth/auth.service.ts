
import { Injectable } from '@angular/core';
import * as firebase from 'firebase/app';
import AuthProvider = firebase.auth.AuthProvider;


import { AngularFirestore, AngularFirestoreCollection } from '@angular/fire/firestore';
import { UserDetail } from '../user/user.interface';
import { AngularFireAuth } from '@angular/fire/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: firebase.User;
  private userCollectionRef: AngularFirestoreCollection<any>;

	constructor(
    private afAuth: AngularFireAuth,
    private afStore: AngularFirestore,
  ) {
    this.userCollectionRef = this.afStore.collection<UserDetail>('users');
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

  signInWithFacebook(): Promise<any> {
    return this.oauthSignIn(new firebase.auth.FacebookAuthProvider());
  }

	private oauthSignIn(provider: AuthProvider): Promise<any> {
		return this.afAuth.auth.signInWithPopup(provider);
	}

}