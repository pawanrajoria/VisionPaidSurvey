import { Injectable, OnInit } from "@angular/core";
import { Auth, getRedirectResult, GoogleAuthProvider, signInWithRedirect } from "@angular/fire/auth";
import { AngularFireAuth } from "@angular/fire/compat/auth";

@Injectable({ providedIn: 'root' })
export class GoogleService implements OnInit {


    constructor( public angularFireAuth: AngularFireAuth,private auth: Auth) {

    }

    ngOnInit() {
        // 1. Check for the redirect result immediately on app load
        this.checkRedirectStatus();
    }

    async checkRedirectStatus(): Promise<any | null> {
        try {
            const result = await getRedirectResult(this.auth);
            debugger;
            if (result) {
                // User successfully signed in via redirect
                const user = result.user;
                console.log('Redirect Sign-In Success:', user);
                // Navigate to your protected route here
                // this.router.navigate(['/dashboard']); 
                return user;
            }
            return null;
        } catch (error) {
            console.error('Error handling redirect result:', error);
            return null;
        }
    }

    async googleSignIn() {
        const provider = new GoogleAuthProvider();
        try {
            // Start the redirect (this leaves your app)
            await signInWithRedirect(this.auth, provider);
            // NOTE: Code after this line will not execute until the app reloads/redirects back.
        } catch (error) {
            console.error('Google sign-in redirect error:', error);
        }
    }
}