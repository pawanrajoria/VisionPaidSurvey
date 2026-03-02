import { Inject, Injectable, Optional, PLATFORM_ID, REQUEST } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DeviceService {

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Optional() @Inject(REQUEST) private request: any
    ) { }

    getUserAgent(): string {

        // SSR
        if (isPlatformServer(this.platformId)) {
            return this.request?.headers?.['user-agent'] || '';
        }

        // Browser
        if (isPlatformBrowser(this.platformId)) {
            return navigator.userAgent || '';
        }

        return '';
    }

    isMobile(): boolean {
        const ua = this.getUserAgent().toLowerCase();

        return /android|iphone|ipad|ipod|windows phone|mobile/i.test(ua);
    }

}
