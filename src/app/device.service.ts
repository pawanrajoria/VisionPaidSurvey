import { DOCUMENT, Inject, Injectable, Optional, PLATFORM_ID, REQUEST } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class DeviceService {

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document
    ) { }

    isMobile(): boolean {
        const userAgent = this.getUserAgent().toLowerCase();
        if (!userAgent) return false;

        // Detect iOS (including modern iPads)
        const isIOS = /iphone|ipad|ipod/.test(userAgent) ||
            (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);

        // Detect Android
        const isAndroid = /android/.test(userAgent);

        // Screen fallback (tablet + small devices)
        const isSmallScreen = window.innerWidth <= 1024;

        return isIOS || isAndroid || isSmallScreen;
    }

    private getUserAgent(): string {
        if (isPlatformBrowser(this.platformId)) {
            return this.document.defaultView?.navigator?.userAgent || navigator.vendor;
        }
        return '';
    }

}
