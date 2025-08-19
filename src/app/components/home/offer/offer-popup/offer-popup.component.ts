import {
    Component,
    OnInit,
    inject
} from '@angular/core';
import { SharedModule } from '../../../../shared.module';
import { OfferService } from '../offer.service';
import {
    IOfferResponseDto,
    IOfferTaskResponseDto
} from '../offer.vm';
import {
    MAT_DIALOG_DATA,
    MatDialog
} from '@angular/material/dialog';
import { BreakpointObserver } from '@angular/cdk/layout';
import { OfferQRDialog } from './offer-qr/offer-qr.component';
import { ConfigService } from '../../../../config.service';
import { BaseComponent } from '../../../../base.component';

@Component({
    selector: 'dialog-offer-popup',
    standalone: true,
    imports: [SharedModule],
    templateUrl: 'offer-popup.component.html',
    styleUrls: ['./offer-popup.component.scss']
})
export class OfferPopupDialog extends BaseComponent implements OnInit {
    readonly offer = inject<IOfferResponseDto>(MAT_DIALOG_DATA);
    readonly dialog = inject(MatDialog);
    readonly offerService = inject(OfferService);
    readonly configService = inject(ConfigService);
    readonly breakpointObserver = inject(BreakpointObserver);

    offerLevels: IOfferTaskResponseDto[] = [];

    constructor() {
        super(); // initializes isBrowser, win, nav, doc
    }

    ngOnInit(): void {
        // Optional: fetch additional tasks or logic on init
    }

    earn(): void {
        const isMobileOrTablet =
            this.offer.currentDevice === 'Mobile' ||
            this.offer.currentDevice === 'Tablet';

        if (isMobileOrTablet) {
            const redirectUrl = `${this.configService.hostingDomain}auth/link?target=${encodeURIComponent(this.offer.clickUrl)}`;
            this.win?.open(redirectUrl, '_blank');
            return;
        }

        let dialogWidth = '600px';

        if (this.isBrowser && this.breakpointObserver.isMatched('(max-width: 600px)')) {
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
