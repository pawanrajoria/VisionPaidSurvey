import { Component, inject, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { IReferalVM } from "../referal.vm";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { ConfigService } from "../../../../config.service";

@Component({
    selector: 'app-referal-popup',
    imports: [SharedModule],
    templateUrl: './referal-popup.component.html',
    styleUrls: ['./referal-popup.component.scss']
})
export class ReferalPopupComponent implements OnInit {
    readonly referal = inject<IReferalVM>(MAT_DIALOG_DATA);
    readonly dialog = inject(MatDialog);

    constructor(private dialogRef: MatDialogRef<ReferalPopupComponent>, private configService: ConfigService) {
    }

    ngOnInit(): void {
        throw new Error("Method not implemented.");
    }

    get referalLink() {
        return `${this.configService.appUrl}/auth/login?referralCode=${this.referal.referLinkCode}`;
    }

    copyLink() {
        navigator.clipboard.writeText(this.referalLink);
    }

    close() {
        this.dialog.closeAll();
    }
}