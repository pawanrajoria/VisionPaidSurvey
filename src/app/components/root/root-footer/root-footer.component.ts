import { Component, OnInit } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseComponent } from "../../../base.component";

@Component({
    selector: 'app-root-footer',
    imports: [PublicSharedModule,MatIconModule],
    templateUrl: './root-footer.component.html',
    styleUrls: ['./root-footer.component.scss']
})
export class RootFooterComponent extends BaseComponent implements OnInit {
    constructor(
        private matIconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer
    ) {
        super();
        this.matIconRegistry.addSvgIcon(
            'facebook',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg')
        );

        this.matIconRegistry.addSvgIcon(
            'twitterx',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/twitter-x.svg')
        );

        this.matIconRegistry.addSvgIcon(
            'linkedin',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/linkedin.svg')
        );
    }

    ngOnInit(): void {
    }

}