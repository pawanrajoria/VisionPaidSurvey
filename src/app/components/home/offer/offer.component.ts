import { Component, inject, OnInit, signal } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { OfferService } from './offer.service';
import { IOfferResponseDto } from './offer.vm';
import { MatDialog } from '@angular/material/dialog';
import { OfferPopupDialog } from './offer-popup/offer-popup.component';
import { BreakpointObserver } from '@angular/cdk/layout';
import { BaseComponent } from '../../../base.component';

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

    constructor() {
        super(); // calls BaseComponent constructor and binds browser globals
    }

    async ngOnInit(): Promise<void> {
        await this.getOffers();
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

    /** Offers this browser opened, newest first - the "My Offers" tab. */
    private readonly myOffersKey = 'my_offer_ids';

    private get myOfferIds(): number[] {
        if (!this.isBrowser) return [];
        try { return JSON.parse(localStorage.getItem(this.myOffersKey) ?? '[]'); } catch { return []; }
    }

    private rememberOffer(id: number) {
        if (!this.isBrowser) return;
        try {
            const ids = [id, ...this.myOfferIds.filter(x => x !== id)].slice(0, 100);
            localStorage.setItem(this.myOffersKey, JSON.stringify(ids));
        } catch { /* storage blocked */ }
    }

    openDialog(item: IOfferResponseDto) {
        this.rememberOffer(item.offerId);

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

        // "My Offers" used to show every offer: it now lists the ones opened here, newest first.
        if (this.offerType === 'My Offers') {
            const order = new Map(this.myOfferIds.map((id, i) => [id, i]));
            this.filteredOffers = this.offers
                .filter(o => order.has(o.offerId) && (o.offerName ?? '').toLowerCase().includes(text))
                .sort((a, b) => order.get(a.offerId)! - order.get(b.offerId)!);
            return;
        }

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
