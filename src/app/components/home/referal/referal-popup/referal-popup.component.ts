import { Component, OnInit, inject } from '@angular/core';
import { SharedModule } from '../../../../shared.module';
import { IReferalVM } from '../referal.vm';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ConfigService } from '../../../../config.service';
import { BaseComponent } from '../../../../base.component';

@Component({
    selector: 'app-referal-popup',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './referal-popup.component.html',
    styleUrls: ['./referal-popup.component.scss']
})
export class ReferalPopupComponent extends BaseComponent implements OnInit {
    readonly referal = inject<IReferalVM>(MAT_DIALOG_DATA);
    readonly dialog = inject(MatDialog);
    readonly configService = inject(ConfigService);
    readonly dialogRef = inject(MatDialogRef<ReferalPopupComponent>);

    constructor() {
        super(); // initializes BaseComponent's browser-safe bindings
    }

    ngOnInit(): void {
        // Optional: handle any dialog-specific init here
    }

    get referalLink(): string {
        return `${this.configService.appUrl}/auth/login?referralCode=${this.referal.referLinkCode}`;
    }

    copyLink(): void {
        if (this.isBrowser && this.win?.navigator?.clipboard) {
            this.win.navigator.clipboard.writeText(this.referalLink);
        }
    }

    close(): void {
        this.dialog.closeAll();
    }
}
