import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from "@angular/core";
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";
import { ActivatedRoute, Router } from "@angular/router";
import { SharedModule } from "../../../shared.module";
import { FaqRootComponent } from "../root-faq/root-faq.component";
import { AuthService } from "../../auth/auth.service";
import { GoogleLoginDirective } from "../../auth/google.directive";
import { GoogleService } from "../../auth/google.service";
import { AngularFireAuth } from "@angular/fire/compat/auth";
import { GoogleAuthProvider, signInWithCredential } from "@firebase/auth";
import { LocalStorageService } from "../../../localstorage.service";
import { isPlatformBrowser } from "@angular/common";
import { BaseComponent } from "../../../base.component";

@Component({
    selector: 'app-root-home',
    imports: [SharedModule, FaqRootComponent],
    templateUrl: './root-home.component.html',
    styleUrls: ['./root-home.component.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                query('mat-card', [
                    style({ opacity: 0, transform: 'translateY(20px)' }),
                    animate('500ms ease-out', style({ opacity: 1, transform: 'none' }))
                ], { optional: true })
            ])
        ]),
        trigger('cardAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.9)' }),
                animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
            ]),
        ]),
    ]
})
export class RootHomeComponent extends BaseComponent implements OnInit {
    selectedCategory = 'Cash';
    email = "";
    password = "";
    isEmailValidCheck: boolean = false;

    surveys = [];
    categories = [
        { name: 'Cash', icon: 'account_balance' },
        { name: 'Gift Cards', icon: 'card_giftcard' },
        { name: 'Donations', icon: 'favorite' },
    ];

    isLoggedIn: boolean = false;

    rewards: Record<string, { amount: string; label: string; logo: string }[]> = {
        Cash: [
            { amount: '$5 – $10', label: 'PayPal', logo: '/assets/images/gift-cards/paypal.png' },
            {
                amount: '$10 – $20',
                label: 'PayPal International',
                logo: '/assets/images/gift-cards/paypal.png',
            },
        ],
        'Gift Cards': [
            { amount: '$5 – $10', label: 'Amazon', logo: '/assets/images/gift-cards/Amazon_Giftcard.jpg' },
            { amount: '$10 – $20', label: 'Amazon', logo: '/assets/images/gift-cards/Amazon_Giftcard.jpg' },
            { amount: '$20 – $30', label: 'Amazon', logo: '/assets/images/gift-cards/Amazon_Giftcard.jpg' },
        ],
        Donations: [
            // {
            //     amount: '$5 – $50',
            //     label: 'Red Cross',
            //     logo: '/assets/images/gift-cards/Visa.png',
            // },
        ],
    };

    giftCards = [
        {
            name: 'PayPal',
            logo: 'assets/images/paypal.png',
            text: 'Earn Paypal gift cards',
        },
        {
            name: 'Amazon',
            logo: 'assets/images/amazon.png',
            text: 'Snag Amazon gift card',
        },
        {
            name: 'Visa',
            logo: 'assets/images/visa.png',
            text: 'Or simply withdraw the cash',
        },
    ];

    bonusCode: string = "";
    constructor(private router: Router, private authService: AuthService,
        private googleAuth: GoogleService, private angularFireAuth: AngularFireAuth,
        private route: ActivatedRoute, private localStorageService: LocalStorageService,
        @Inject(PLATFORM_ID) private platformId: Object) {
        super();

    }

    async googleLogin() {
        if (!isPlatformBrowser(this.platformId)) return;

        const googleToken = await this.googleAuth.loginWithGoogleTab();
        if (googleToken) {
            this.localStorageService.removeItem('token');
            const credential = GoogleAuthProvider.credential(null, googleToken);
            const userCredential = await this.angularFireAuth.signInWithCredential(credential);



            if (userCredential != null && userCredential.user != null) {
                const idToken = await userCredential.user.getIdToken();

                const response = await this.authService.firebaseLogin({
                    idToken: idToken,
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


    async ngOnInit() {

        if (isPlatformBrowser(this.platformId)) {
            this.route.queryParams.subscribe(params => {
                const ref = params['referralCode'];
                if (ref) {
                    this.bonusCode = ref;
                }
            });
        }

        this.isLoggedIn = await this.authService.isAuthenticated();
    }


    selectCategory(category: string) {
        this.selectedCategory = category;
    }

    selectReward(reward: any) {
        // console.log('Selected:', reward);
    }

    goToApp() {
        if (this.isLoggedIn) {
            this.router.navigate(['/app']);
        } else {
            this.router.navigate(['/auth/login']);
        }
    }

    async login() {
        const self = this;
        if (!self.email) return;

        if (!self.isEmailValidCheck) {
            const response = await self.authService.loginbyemail({ email: self.email });
            if (!!response && response.isSuccess) {
                self.isEmailValidCheck = true;
            }
            else {
                self.router.navigate(['/auth/signup', self.authService.encrypt(self.email)]);
            }
        }
        else {
            if (!self.password) return;

            const request = {
                password: self.password,
                email: self.email
            }
            await self.authService.login(request);
        }
    }

    forgotPassword() {

    }
}