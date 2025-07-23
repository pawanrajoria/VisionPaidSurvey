import { Directive, HostListener } from "@angular/core";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { ActivatedRoute, Router } from "@angular/router";
import { GoogleAuthProvider } from "@firebase/auth";
import { AuthService } from "./auth.service";
import { LocalStorageService } from "../../localstorage.service";

@Directive({
    selector: "[googlelogin]",
})
export class GoogleLoginDirective {
    bonusCode: string = "";
    constructor(private angularFireAuth: AngularFireAuth, private router: Router,
        private authService: AuthService, private route: ActivatedRoute,
        private localStorageService: LocalStorageService,) {
        this.route.queryParams.subscribe(params => {
            const ref = params['referralCode'];
            if (ref) {
                this.bonusCode = ref;
            }
        });
    }


    @HostListener("click")
    async onClick(): Promise<void> {

        const userCredential: any = await this.angularFireAuth.signInWithPopup(new GoogleAuthProvider());
        const token = userCredential.credential.idToken;
        if (token) {
            this.localStorageService.removeItem('token');
            const response = await this.authService.firebaseLogin({
                idToken: token,
                fullName: userCredential.user?.displayName,
                userId: userCredential.user?.uid,
                imageSrc: userCredential.user?.photoURL,
                emailVerified: userCredential.user?.emailVerified,
                phoneNumber: userCredential.user?.phoneNumber,
                bonusCode: this.bonusCode
            });
            if (!!response && !!response.token) {
                this.localStorageService.setItem("token", response.token);
                this.router.navigate(['/app']);
            }
        }

    }
}