import { Component, inject, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { ReferalService } from "./referal.service";
import { IReferalVM } from "./referal.vm";
import { ReferalPopupComponent } from "./referal-popup/referal-popup.component";
import { MatDialog } from "@angular/material/dialog";

@Component({
    selector: 'app-referal',
    imports: [SharedModule],
    templateUrl: './referal.component.html',
    styleUrls: ['./referal.component.scss']
})
export class ReferalComponent implements OnInit {

    referDetails: IReferalVM = { referCode: '', totalEarning: 0, totalUser: 0, referLinkCode: '' };

    steps = [
        {
            number: 1,
            title: 'Invite your friends',
            description: 'Tell your friends about Profit Piller and share it on Social Media'
        },
        {
            number: 2,
            title: 'Share your bonus code',
            description: 'New users that redeem your bonus code within 24 hours after signing up become your referral and get a 10% bonus for 24 hours'
        },
        {
            number: 3,
            title: 'Receive your commission',
            description: 'Earn 10% commission on your friends\' income for all surveys they complete. Your friends\' income remains the same!'
        }
    ];

    readonly dialog = inject(MatDialog);

    constructor(private referalService: ReferalService) {

    }

    async ngOnInit() {
        await this.getReferalInfo();
    }

    copyCode() {
        navigator.clipboard.writeText(this.referDetails.referCode);
    }

    async getReferalInfo() {
        const self = this;

        self.referDetails = await self.referalService.getReferInfo();
    }

    copyLink() {
        this.dialog.open(ReferalPopupComponent, {
            maxWidth: '100vw',
            panelClass: 'custom-dialog-container',
            data: this.referDetails
        });
    }

}