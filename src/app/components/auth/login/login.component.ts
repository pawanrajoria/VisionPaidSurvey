import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { GoogleLoginDirective } from "../google.directive";
import { AuthService } from "../auth.service";
import { SharedDataService } from "../../../shared.data.service";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { LocalStorageService } from "../../../localstorage.service";
import { GoogleService } from "../google.service";
import { FacebookAuthProvider, GoogleAuthProvider, OAuthProvider } from "@firebase/auth";
import { MessageService } from "../../layout/message/message.service";
import { MessageVM } from "../../layout/message/message.vm";
import { FraudService } from "../../../frauddetection.service";


@Component({
    selector: 'app-login',
    imports: [SharedModule],
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
    isEmailValidCheck: boolean = false;
    bonusCode: string = '';
    defaultAmount: string = "10";

    loginForm!: FormGroup;

    constructor(private fb: FormBuilder, private router: Router, private authService: AuthService,
        private sharedDataService: SharedDataService, private activatedRoute: ActivatedRoute,
        private googleAuth: GoogleService, private localStorageService: LocalStorageService,
        private fraudService: FraudService,
        private angularFireAuth: AngularFireAuth, private messageService: MessageService) {
        this.loginForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required]
        });

        this.activatedRoute.queryParams.subscribe(params => {
            const ref = params['referralCode'];
            if (ref) {
                this.bonusCode = ref;
            }
        });

    }


    ngOnInit(): void {
        this.fraudService.resetTracking();
        this.fraudService.startTracking();
    }

    async googleLogin() {
        const googleToken = await this.googleAuth.loginWithGoogleTab();
        if (googleToken) {
            this.localStorageService.removeItem('token');
            this.localStorageService.setItem('bonusCode', this.bonusCode);
            const credential = GoogleAuthProvider.credential(null, googleToken);
            const userCredential = await this.angularFireAuth.signInWithCredential(credential);

            if (userCredential != null && userCredential.user != null) {
                const idToken = await userCredential.user.getIdToken();

                await this.authService.firebaseLogin({
                    idToken: idToken,
                    fullName: userCredential.user?.displayName,
                    userId: userCredential.user?.uid,
                    imageSrc: userCredential.user?.photoURL,
                    emailVerified: userCredential.user?.emailVerified,
                    phoneNumber: userCredential.user?.phoneNumber,
                    bonusCode: this.bonusCode
                });
            }
        }
    }

    socialBusy = false;

    /**
     * Apple / Facebook sign-in through Firebase. The provider must be enabled in the Firebase
     * console (Authentication > Sign-in method) for the popup to work. The API reads which
     * provider was used from the verified Firebase token and stores it against the user.
     */
    async socialLogin(kind: 'apple' | 'facebook') {
        if (this.socialBusy) return;
        this.socialBusy = true;
        try {
            let provider: OAuthProvider | FacebookAuthProvider;
            if (kind === 'apple') {
                provider = new OAuthProvider('apple.com');
                provider.addScope('email');
                provider.addScope('name');
            } else {
                provider = new FacebookAuthProvider();
                provider.addScope('email');
            }

            const userCredential: any = await this.angularFireAuth.signInWithPopup(provider as any);
            const user = userCredential?.user;
            if (!user) return;

            this.localStorageService.removeItem('token');
            this.localStorageService.setItem('bonusCode', this.bonusCode);

            await this.authService.firebaseLogin({
                idToken: await user.getIdToken(),
                fullName: user.displayName,
                userId: user.uid,
                imageSrc: user.photoURL,
                emailVerified: user.emailVerified,
                phoneNumber: user.phoneNumber,
                bonusCode: this.bonusCode
            });
        } catch (error: any) {
            const code = error?.code ?? '';
            if (code === 'auth/popup-closed-by-user' || code === 'auth/cancelled-popup-request') {
                return;
            }
            // API errors were already shown by the HTTP interceptor.
            if (!code) return;

            const label = kind === 'apple' ? 'Apple' : 'Facebook';
            const message =
                code === 'auth/account-exists-with-different-credential'
                    ? 'An account with this email already exists. Please sign in the way you did before (Google or email and password).'
                    : code === 'auth/operation-not-allowed'
                        ? `${label} sign-in is not available yet. Please use Google or your email.`
                        : code === 'auth/popup-blocked'
                            ? 'Your browser blocked the sign-in window. Please allow pop-ups and try again.'
                            : `${label} sign-in failed. Please try again.`;
            this.messageService.showMessage(new MessageVM(message, 'error'));
        } finally {
            this.socialBusy = false;
        }
    }

    async submit() {
        const self = this;
        if (self.loginForm.get('email')?.invalid) return;

        if (!self.isEmailValidCheck) {
            const response = await self.authService.loginbyemail({ email: self.loginForm.get('email')?.value });
            if (!!response && response.isSuccess) {
                self.isEmailValidCheck = true;
            }
            else {
                self.router.navigate(
                    ['/auth/signup', this.authService.encrypt(this.loginForm.get('email')?.value)],
                    { queryParams: { referralCode: self.bonusCode } } // 'ref' is the query param key
                );
            }
        }
        else {
            if (self.loginForm?.invalid) return;

            await self.authService.login(self.loginForm.value);
        }

    }

    forgotPassword() {
        const self = this;
        if (self.loginForm.get('email')?.invalid) {
            self.loginForm.markAllAsTouched();
            return;
        };

        this.sharedDataService.setData({ email: this.loginForm.get('email')?.value });
        self.router.navigate(['/auth/forgot-password']);
    }


}