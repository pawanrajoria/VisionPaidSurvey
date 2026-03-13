import { Component, Inject, OnInit, PLATFORM_ID, ViewEncapsulation } from "@angular/core";
import { SharedModule } from "../../shared.module";
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";
import { RootFooterComponent } from "./root-footer/root-footer.component";
import { RootHeaderComponent } from "./root-header/root-header.component";
import { Router } from "@angular/router";
import { CookiePolicyPopupComponent } from "./root-cookiepolicy/root-cookie-policy-popup/root-cookie-policy-popup";
import { MatSnackBar } from "@angular/material/snack-bar";
import { LocalStorageService } from "../../localstorage.service";
import { isPlatformBrowser } from "@angular/common";
import { ApkToggleComponent } from "./apk-toggle/apk-toggle.component";
import { DeviceService } from "../../device.service";

@Component({
    selector: 'app-root',
    imports: [SharedModule, RootHeaderComponent, RootFooterComponent, ApkToggleComponent],
    templateUrl: './root.component.html',
    styleUrls: ['./root.component.scss'],
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
export class RootComponent implements OnInit {
    selectedCategory = 'Cash';
    isMobile = false;
    categories = [
        { name: 'Cash', icon: 'account_balance' },
        { name: 'Gift Cards', icon: 'card_giftcard' },
        { name: 'Donations', icon: 'favorite' },
    ];

    rewards: Record<string, { amount: string; label: string; logo: string }[]> = {
        Cash: [
            { amount: '$5 – $100', label: 'PayPal', logo: '/assets/paypal.png' },
            {
                amount: '$5 – $100',
                label: 'PayPal International',
                logo: '/assets/paypal.png',
            },
        ],
        'Gift Cards': [
            { amount: '$10 – $100', label: 'Amazon', logo: '/assets/amazon.png' },
        ],
        Donations: [
            {
                amount: '$5 – $50',
                label: 'Red Cross',
                logo: '/assets/donation.png',
            },
        ],
    };

    giftCards = [
        {
            name: 'PayPal',
            logo: 'assets/paypal.png',
            text: 'Earn Paypal gift cards',
        },
        {
            name: 'Amazon',
            logo: 'assets/amazon.png',
            text: 'Snag Amazon gift card',
        },
        {
            name: 'Visa',
            logo: 'assets/visa.png',
            text: 'Or simply withdraw the cash',
        },
    ];


    constructor(private router: Router, private snackBar: MatSnackBar,
        private deviceService: DeviceService,
        private localStorageService: LocalStorageService, @Inject(PLATFORM_ID) private platformId: Object) {

    }


    ngOnInit(): void {
        if (isPlatformBrowser(this.platformId)) {
            this.isMobile = this.deviceService.isMobile();

            setTimeout(() => {
                this.showConsent();
            }, 0);
        }
    }


    selectCategory(category: string) {
        this.selectedCategory = category;
    }

    selectReward(reward: any) {
        // console.log('Selected:', reward);
    }

    goToApp() {
        this.router.navigate(['/auth/login']);
    }


    showConsent(isfrompageLoad: boolean = true) {
        if (!isfrompageLoad) {
            this.snackBar.openFromComponent(CookiePolicyPopupComponent, {
                duration: 0, // stays open until action
                horizontalPosition: 'center',
                verticalPosition: 'bottom',
                panelClass: ['cookie-snackbar']
            });
        }
        else {
            const consent = this.localStorageService.getItem('cookiesAccepted');
            if (consent === null) {
                this.snackBar.openFromComponent(CookiePolicyPopupComponent, {
                    duration: 0, // stays open until action
                    horizontalPosition: 'center',
                    verticalPosition: 'bottom',
                    panelClass: ['cookie-snackbar']
                });
            }
        }
    }


}