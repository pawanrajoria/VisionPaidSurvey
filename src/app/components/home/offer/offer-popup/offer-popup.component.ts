
import { ChangeDetectionStrategy, Component, Inject, inject, OnInit, PLATFORM_ID, ViewEncapsulation } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { OfferService } from "../offer.service";
import { IOfferResponseDto, IOfferTaskResponseDto } from "../offer.vm";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { isPlatformBrowser } from "@angular/common";
import { BreakpointObserver } from "@angular/cdk/layout";
import { OfferQRDialog } from "./offer-qr/offer-qr.component";
import { ConfigService } from "../../../../config.service";

@Component({
    selector: 'dialog-offer-popup',
    imports: [SharedModule],
    templateUrl: 'offer-popup.component.html',
    styleUrls: ['./offer-popup.component.scss']
})
export class OfferPopupDialog implements OnInit {
    readonly offer = inject<IOfferResponseDto>(MAT_DIALOG_DATA);
    readonly dialog = inject(MatDialog);

    offerLevels: Array<IOfferTaskResponseDto> = [];

    constructor(private offerService: OfferService, private breakpointObserver: BreakpointObserver,
        @Inject(PLATFORM_ID) private platformId: any, private configService: ConfigService) {

    }

    async ngOnInit() {
    }

    earn() {

        if (this.offer.currentDevice == 'Mobile' || this.offer.currentDevice == 'Tablet' || this.offer.device.findIndex(p => p.indexOf('All') > -1) > -1) {
            const redirectUrl = `${this.configService.hostingDomain}auth/link?target=${encodeURIComponent(this.offer.clickUrl)}`;
            window.open(redirectUrl, '_blank');
            return;
        }

        let dialogWidth = '600px';

        if (isPlatformBrowser(this.platformId) && this.breakpointObserver.isMatched('(max-width: 600px)')) {
            dialogWidth = '100vw';
        }


        this.dialog.open(OfferQRDialog, {
            width: dialogWidth,
            maxWidth: '100vw',
            panelClass: 'custom-dialog-container',
            data: this.offer
        });
    }

}