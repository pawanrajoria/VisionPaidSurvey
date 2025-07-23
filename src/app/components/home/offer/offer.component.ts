import { Component, Inject, inject, OnInit, PLATFORM_ID, signal } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { OfferService } from "./offer.service";
import { IOfferResponseDto } from "./offer.vm";
import { MatDialog } from "@angular/material/dialog";
import { OfferPopupDialog } from "./offer-popup/offer-popup.component";
import { BreakpointObserver } from "@angular/cdk/layout";
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-offer',
    imports: [SharedModule],
    templateUrl: './offer.component.html',
    styleUrls: ['./offer.component.scss']
})
export class OfferComponent implements OnInit {
    hideMultipleSelectionIndicator = signal(false);

    offers: Array<IOfferResponseDto> = [];
    filteredOffers = [...this.offers];
    links = ['Best Match Offers', 'Most Points Offers', 'My Offers',];
    activeLink = this.links[0];
    offerType: string = "Best Match Offers";

    selectedDeviceType: string[] = [];
    searchTxt = "";

    readonly dialog = inject(MatDialog);

    constructor(private offerService: OfferService, private breakpointObserver: BreakpointObserver, @Inject(PLATFORM_ID) private platformId: any) {

    }

    async ngOnInit() {
        await this.getOffers();
    }

    changeSurveyType(linkType: string) {
        this.offerType = linkType;
        this.filterItems();
    }

    async getOffers() {
        const self = this;
        self.offers = await self.offerService.getOffers();
        self.filterItems();
    }

    openDialog(item: IOfferResponseDto) {
        let dialogWidth = '600px';

        if (isPlatformBrowser(this.platformId) && this.breakpointObserver.isMatched('(max-width: 600px)')) {
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

        this.filteredOffers = this.offers.filter(item => {
            const matchesCategory =
                this.selectedDeviceType.length === 0 ||
                item.device.some(cat => this.selectedDeviceType.includes(cat));

            const matchesText = item.offerName?.toLowerCase().includes(text);

            return matchesCategory && matchesText;
        }).sort((a, b) => {
            if (this.offerType === 'Best Match Offers') {
                return b.offerId - a.offerId;
            } else {
                return b.points - a.points;
            }
        });
    }


    get currentDevice(): string {
        const ua = navigator.userAgent;

        if (/iPhone|iPad|iPod|Android/i.test(ua)) {
            return 'Mobile';
        } else if (/Tablet|iPad/i.test(ua)) {
            return 'Tablet';
        } else {
            return 'Desktop';
        }
    }

    // get filteredOffers(): Array<IOfferResponseDto> {
    //     if(!!this.deviceType && this.deviceType.length > 0)
    //         console.log(this.deviceType);

    //     return !!this.deviceType && this.deviceType.length > 0 ? this.offers.filter(p => p.device?.toString().includes(this.deviceType.toString()))
    //         : !!this.searchTxt && this.searchTxt.length > 0 ? this.offers.filter(p => p.offerName?.toLowerCase()?.includes(this.searchTxt.toLowerCase()))
    //             : this.offers || [];
    // }

}