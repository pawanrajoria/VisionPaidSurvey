import { AfterViewInit, Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
import { SharedModule } from "../../../../../shared.module";
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from "@angular/material/dialog";
import { IOfferResponseDto } from "../../offer.vm";
import { BaseComponent } from "../../../../../base.component"; // Adjust the path as needed

import { NgxQrcodeStylingComponent } from 'ngx-qrcode-styling';

@Component({
    selector: 'dialog-offer-qr',
    imports: [SharedModule, NgxQrcodeStylingComponent],
    templateUrl: 'offer-qr.component.html',
    styleUrls: ['./offer-qr.component.scss']
})
export class OfferQRDialog extends BaseComponent implements AfterViewInit {
    readonly offer = inject<IOfferResponseDto>(MAT_DIALOG_DATA);
    readonly dialog = inject(MatDialog);

    constructor(private dialogRef: MatDialogRef<OfferQRDialog>) {
        super();
    }

    ngAfterViewInit() {
    }

    onClose() {
        this.dialog.closeAll();
    }

    onBack() {
        this.dialogRef.close();
    }

    copyToClipboard(text: string) {
        if (!!this.nav) {
            this.nav.clipboard.writeText(text).then(() => {
                // console.log('Copied to clipboard:', text);
                // You can show a snackbar/toast if desired
            });
        }
    }

}