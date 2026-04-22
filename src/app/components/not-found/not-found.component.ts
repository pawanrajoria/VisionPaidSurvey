import { ChangeDetectorRef, Component, HostListener, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, Location } from '@angular/common';
import { SharedModule } from '../../shared.module';
import { BaseComponent } from '../../base.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateComponent } from '../layout/translator/translator.component';
import { ApkToggleComponent } from "../root/apk-toggle/apk-toggle.component";
import { RootFooterComponent } from "../root/root-footer/root-footer.component";
import { RootHeaderComponent } from "../root/root-header/root-header.component";
import { DeviceService } from '../../device.service';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
    selector: 'app-not-found',
    standalone: true,
    imports: [SharedModule, ApkToggleComponent, RootFooterComponent, RootHeaderComponent],
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss']
})
export class NotFoundComponent extends BaseComponent implements OnInit {
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
        private cdr: ChangeDetectorRef,
        private deviceService: DeviceService, @Inject(PLATFORM_ID) private platformId: Object) {
        super();

    }


    async ngOnInit() {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => {
                this.isMobile = this.deviceService.isMobile();
                this.cdr.markForCheck(); // Better for Standalone/OnPush
                this.cdr.detectChanges(); // Forces immediate update
            });
        }
    }

    selectCategory(category: string) {
        this.selectedCategory = category;
    }

    selectReward(reward: any) {
        // console.log('Selected:', reward);
    }

    goToApp() {
        this.router.navigate(['/']);
    }

}