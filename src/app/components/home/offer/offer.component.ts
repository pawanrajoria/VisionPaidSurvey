import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { OfferService } from './offer.service';
import { IOfferResponseDto } from './offer.vm';
import { MatDialog } from '@angular/material/dialog';
import { OfferPopupDialog } from './offer-popup/offer-popup.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BaseComponent } from '../../../base.component';
import { Router } from '@angular/router';
import { EngagementService } from '../engagement/engagement.service';
import { IPriorityOffer } from '../engagement/engagement.vm';

@Component({
    selector: 'app-offer',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './offer.component.html',
    styleUrls: ['./offer.component.scss']
})
export class OfferComponent extends BaseComponent implements OnInit {
    hideMultipleSelectionIndicator = signal(false);

    offers: IOfferResponseDto[] = [];
    filteredOffers: IOfferResponseDto[] = [];

    links = ['Best Match Offers', 'Most Points Offers', 'My Offers'];
    activeLink = this.links[0];
    offerType = 'Best Match Offers';

    selectedDeviceType: string[] = [];
    searchTxt = '';

    readonly dialog = inject(MatDialog);
    readonly offerService = inject(OfferService);
    readonly breakpointObserver = inject(BreakpointObserver);
    private readonly engagement = inject(EngagementService);
    private readonly router = inject(Router);

    /** Special offers uploaded from the admin console (same list as the Earn page and the app). */
    specialOffers: IPriorityOffer[] = [];

    constructor() {
        super(); // calls BaseComponent constructor and binds browser globals
    }

    async ngOnInit(): Promise<void> {
        this.loadSpecialOffers();
        await this.getOffers();
    }

    async loadSpecialOffers() {
        if (!this.isBrowser) return;
        const offers = await this.engagement.getPriorityOffers();
        const device = this.specialDevice;
        this.specialOffers = offers.filter(o => !o.device || o.device === 'All' || o.device === device);
    }

    /** Desktop | Android | IOS - the Device values an admin can pick for a special offer. */
    private get specialDevice(): string {
        const ua = this.nav?.userAgent ?? '';
        if (/iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && (this.nav?.maxTouchPoints ?? 0) > 1)) return 'IOS';
        if (/Android/i.test(ua)) return 'Android';
        return 'Desktop';
    }

    openSpecialOffer(offer: IPriorityOffer) {
        // Open first, track second: a window opened after an await is treated as a popup and blocked.
        if (offer.isInternal) {
            this.router.navigateByUrl(`/${this.currentLocale}${offer.clickUrl}`);
        } else {
            this.win?.open(offer.clickUrl, '_blank', 'noopener');
        }
        this.engagement.trackPriorityClick(offer.id);
    }

    hideSpecialImage(offer: IPriorityOffer) {
        offer.imageUrl = null;
    }

    async getOffers() {
        this.offers = (await this.offerService.getOffers()) ?? [];
        this.preselectPlatform();
        this.filterItems();
    }

    changeSurveyType(linkType: string) {
        this.offerType = linkType;
        this.filterItems();
    }

    openDialog(item: IOfferResponseDto) {
        let dialogWidth = '600px';

        if (this.isBrowser && this.breakpointObserver.isMatched('(max-width: 600px)')) {
            dialogWidth = '100vw';
        }

        item.currentDevice = this.currentDevice;

        this.dialog.open(OfferPopupDialog, {
            width: dialogWidth,
            maxWidth: '100vw',
            panelClass: 'custom-dialog-container',
            data: item
        });
    }

    filterItems() {
        const text = this.searchTxt.toLowerCase();

        this.filteredOffers = this.offers
            .filter(item => {
                // An offer without device information is not restricted to a platform.
                const devices = item.device ?? [];
                const matchesCategory =
                    this.selectedDeviceType.length === 0 || devices.length === 0 ||
                    devices.some(cat => this.selectedDeviceType.includes(cat));

                const matchesText = item.offerName?.toLowerCase().includes(text);
                return matchesCategory && matchesText;
            })
            .sort((a, b) => {
                if (this.offerType === 'Best Match Offers') {
                    return b.offerId - a.offerId;
                } else {
                    return b.points - a.points;
                }
            });
    }

    private platformPreselected = false;

    /** Starts the device filter on the visitor's own platform; the chips stay changeable. */
    private preselectPlatform() {
        if (this.platformPreselected || !this.isBrowser || !this.nav) return;
        this.platformPreselected = true;
        const ua = this.nav.userAgent;
        const platform = /iPhone|iPad|iPod/i.test(ua) || (/Macintosh/i.test(ua) && this.nav.maxTouchPoints > 1) ? 'IOS'
            : /Android/i.test(ua) ? 'Android' : 'Desktop';
        if (this.offers.some(o => (o.device ?? []).includes(platform))) {
            this.selectedDeviceType = [platform];
        }
    }

    get currentDevice(): string {
        if (!this.isBrowser || !this.nav) return 'Unknown';

        const ua = this.nav.userAgent;
        if (/iPhone|iPad|iPod|Android/i.test(ua)) return 'Mobile';
        if (/Tablet|iPad/i.test(ua)) return 'Tablet';
        return 'Desktop';
    }
}
