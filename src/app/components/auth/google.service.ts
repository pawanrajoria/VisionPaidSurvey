import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import firebase from 'firebase/compat/app'; // ✅ Required for compat

@Injectable({ providedIn: 'root' })
export class GoogleService {
  constructor(private afAuth: AngularFireAuth) {}

  // 🔹 Set Firebase persistence
  async setPersistence() {
    try {
      await this.afAuth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);
      console.log('Persistence set to LOCAL');
    } catch (error) {
      console.error('Error setting persistence:', error);
    }
  }

  // 🔹 Start Google Sign-In via redirect
  googleSignIn() {
    const provider = new firebase.auth.GoogleAuthProvider();
    return this.afAuth.signInWithRedirect(provider);
  }

  // 🔹 Handle redirect result after returning from Google
  async checkRedirect() {
    try {
      const result = await this.afAuth.getRedirectResult();
      if (result.user) {
        console.log('Redirect Sign-In Success:', result.user);
        // You can store this in localStorage if needed
      } else {
        console.log('No redirect result found.');
      }
    } catch (error) {
      console.error('Redirect error:', error);
    }
  }

  // 🔹 Observe the currently logged-in user
  observeUser() {
    this.afAuth.authState.subscribe(user => {
      console.log('Auth state changed:', user);
      // You can also store user in a shared service or localStorage here
    });
  }
}
