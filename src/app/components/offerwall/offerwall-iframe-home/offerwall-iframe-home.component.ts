import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OfferwallService } from '../offerwall-service';
import { HelperService } from '../../userflow/helper.service';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from '../../../localstorage.service';

// let nodeCrypto: typeof import('crypto') | undefined;

@Component({
    selector: 'app-iframe-offerwall-home',
    standalone: true,
    templateUrl: './offerwall-iframe-home.component.html',
    styleUrls: ['./offerwall-iframe-home.component.scss'],
    imports: [SharedModule]
})
export class OfferwallIframeHomeComponent extends BaseComponent implements OnInit {
    accepted = false;
    iframeUrl: SafeResourceUrl | null = null;
    constructor(
        private offerwallService: OfferwallService,
        private helperService: HelperService,
        private localStorageService: LocalStorageService,        
        private sanitizer: DomSanitizer
    ) {
        super();
        this.registerUser();
    }

    async ngOnInit() {
    }


    async registerUser() {
        const duid = this.helperService.fetchDuid();
        if (!duid && this.win) {
            this.win.location.reload();
            return;
        }

        let landedUrl: string = this.localStorageService.getItem('LandedUrl') || '';
        if (this.win && landedUrl.length !== this.win.location.href.length) {
            landedUrl = this.win.location.href;
        }

        const request: any = {
            url: landedUrl,
            duid: duid,
            referalUrl: this.doc?.referrer || ''
        };
        const response = await this.offerwallService.getIframeUrl(request);
        if (response && response.data) {
            this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(response.data);
        }
    }

}
