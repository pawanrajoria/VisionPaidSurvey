import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { OfferwallService } from '../offerwall-service';
import { HelperService } from '../../userflow/helper.service';
import { BaseComponent } from '../../../base.component';
import { LocalStorageService } from '../../../localstorage.service';


@Component({
    selector: 'app-offerwall-home',
    standalone: true,
    templateUrl: './offerwall-home.component.html',
    styleUrls: ['./offerwall-home.component.scss'],
    imports: [SharedModule]
})
export class OfferwallHomeComponent extends BaseComponent implements OnInit {
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
        const duid = await this.helperService.getOrInitializeDuid();

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


    activeTab = 'Surveys';

    surveys = [
        { id: 1, amount: '0.14', rating: 5, duration: 10 },
        { id: 2, amount: '0.35', rating: 5, duration: 26 },
        { id: 3, amount: '0.20', rating: 4, duration: 45 },
        { id: 4, amount: '0.62', rating: 5, duration: 15 },
    ];
}
