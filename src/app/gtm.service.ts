import {
    Injectable,
    Inject,
    PLATFORM_ID
} from '@angular/core';
import {
    DOCUMENT,
    isPlatformBrowser
} from '@angular/common';

@Injectable({
    providedIn: 'root'
})
export class GtmService {

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document
    ) { }

    pushEvent(eventName: string, data: Record<string, any> = {}) {

        if (!isPlatformBrowser(this.platformId)) {
            return;
        }

        const win = this.document.defaultView as any;

        win.dataLayer = win.dataLayer || [];

        win.dataLayer.push({
            event: eventName,
            ...data
        });
        
    }

    get location(): string {
        return this.document.location?.href ?? '';
    }

    get title(): string {
        return this.document.title ?? '';
    }
}