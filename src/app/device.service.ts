import { DOCUMENT, Inject, Injectable, Optional, PLATFORM_ID, REQUEST } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DeviceService {

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document
    ) { }

    isMobile(): boolean {
        const ua = this.getUserAgent().toLowerCase();
        if (!ua) return false;

        return /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini|mobile|mobi|silk/i.test(ua);
    }

    private getUserAgent(): string {
        if (isPlatformBrowser(this.platformId)) {
            return this.document.defaultView?.navigator?.userAgent || '';
        }
        return '';
    }

}
