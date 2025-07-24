import { Component, inject, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { MAT_DIALOG_DATA, MatDialog } from "@angular/material/dialog";
import { DomSanitizer, SafeResourceUrl } from "@angular/platform-browser";
import { BaseComponent } from "../../../../base.component";

@Component({
    selector: 'dialog-iframe-offerwall',
    imports: [SharedModule],
    templateUrl: 'iframe-offerwall.component.html',
    styleUrls: ['./iframe-offerwall.component.scss']
})
export class IFrameOfferWallDialog extends BaseComponent implements OnInit {
    readonly data = inject<any>(MAT_DIALOG_DATA);
    readonly dialog = inject(MatDialog);

    safeUrl: SafeResourceUrl;

    constructor(private sanitizer: DomSanitizer) {
        super();
        this.safeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.data.iFrameUrl);
    }

    async ngOnInit() {
        await this.logUserActivity("OfferWall", this.data.partner.name, "Click", this.data.iFrameUrl);
    }

    onClose() {

    }
}