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
        this.offers = await this.offerService.getOffers();
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
                const matchesCategory =
                    this.selectedDeviceType.length === 0 ||
                    item.device.some(cat => this.selectedDeviceType.includes(cat));

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

    get currentDevice(): string {
        if (!this.isBrowser || !this.nav) return 'Unknown';

        const ua = this.nav.userAgent;
        if (/iPhone|iPad|iPod|Android/i.test(ua)) return 'Mobile';
        if (/Tablet|iPad/i.test(ua)) return 'Tablet';
        return 'Desktop';
    }
}
