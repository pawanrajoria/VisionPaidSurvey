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
import { TranslateService } from '@ngx-translate/core';

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
    readonly translate = inject(TranslateService);

    offerLevels: IOfferTaskResponseDto[] = [];

    constructor() {
        super(); // initializes isBrowser, win, nav, doc
    }

    /** The network's steps, or - when it sends none (single-step offers) - steps built from the offer itself. */
    steps: { name: string; points: number }[] = [];

    ngOnInit(): void {
        const tasks = (this.offer.tasks ?? []).filter(t => !!t?.name);
        if (tasks.length) {
            this.steps = tasks.map(t => ({ name: t.name ?? '', points: Number(t.points) || 0 }));
            return;
        }
        const t = this.translate;
        const goal = (this.offer.requirements || this.offer.description || t.instant('app.offers.stepGoal')).trim();
        this.steps = [
            { name: t.instant('app.offers.stepOpen'), points: 0 },
            { name: goal, points: Number(this.offer.points) > 0 ? Number(this.offer.points) : 0 },
            { name: this.offer.confirmationTime
                ? t.instant('app.offers.stepConfirmAfter', { time: this.offer.confirmationTime })
                : t.instant('app.offers.stepConfirm'), points: 0 }
        ];
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
