import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";
import { Router } from "@angular/router";
import { SharedModule } from "../../../shared.module";
import { FaqRootComponent } from "../root-faq/root-faq.component";
import { AuthService } from "../../auth/auth.service";
import { GoogleLoginDirective } from "../../auth/google.directive";

@Component({
    selector: 'app-root-home',
    imports: [SharedModule, FaqRootComponent, GoogleLoginDirective],
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
export class RootHomeComponent implements OnInit {
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


    constructor(private router: Router, private authService: AuthService) {
    }


    async ngOnInit() {
        this.isLoggedIn = await this.authService.isAuthenticated();
    }


    selectCategory(category: string) {
        this.selectedCategory = category;
    }

    selectReward(reward: any) {
        console.log('Selected:', reward);
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