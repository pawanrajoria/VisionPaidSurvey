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
import { GoogleAuthProvider } from "@firebase/auth";
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
        private angularFireAuth: AngularFireAuth) {
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