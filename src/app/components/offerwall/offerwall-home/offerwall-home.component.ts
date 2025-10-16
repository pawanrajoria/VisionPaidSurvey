import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { isPlatformServer, isPlatformBrowser } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

// let nodeCrypto: typeof import('crypto') | undefined;

@Component({
    selector: 'app-offerwall-home',
    standalone: true,
    templateUrl: './offerwall-home.component.html',
    styleUrls: ['./offerwall-home.component.scss'],
    imports: [SharedModule]
})
export class OfferwallHomeComponent implements OnInit {
    accepted = false;

    iframeUrl: SafeResourceUrl | null = null;
    private baseUrl = "https://www.surveyb.in/configuration?params=RVZRaEdyUmdNZlZOVEZPOVVaNFJxd2p2cU03WDJxbElHMThNdi9qbHJNaXpYT2NxQWNPMDlVdnY0bXh5K0hnK1NkQlFNZFhUOExHSmRRR1VEUkxISTBwSjRWc291SHBZRzlBNFdoMXA5UmNhVUFqQjBreWNJQ0pTWTFFaEFCUktzbzllMDJNclZIaytSZE5xVkRmR1dyOEN2QVJpTUljeGVSSEVaWC9WUjdIUzVqdjMzL3Q1dzlEUFR6bDc1dkRablZnWDlWbXRJanI2bjBxZGYyRGcvMklyNGtFblh2WXRqUGNWWG9aQUxSWT0";
    private key = '256C0D01-C8C7-4368-9871-44E1E1693B34';
    private appUid = '1312313';

    constructor(
        @Inject(PLATFORM_ID) private platformId: Object,
        private sanitizer: DomSanitizer
    ) {
        if (isPlatformServer(this.platformId)) {
            // nodeCrypto = require('crypto'); // Node crypto available only on server
        }
    }

    async ngOnInit() {
    }
    //     let hash: string;

    //     if (isPlatformServer(this.platformId)) {
    //         // ✅ Server-side HMAC (Node crypto, matches .NET)
    //         hash = nodeCrypto!
    //             .createHmac('sha256', this.key)
    //             .update(this.baseUrl, 'utf-8')
    //             .digest('base64')
    //             .replace(/\+/g, '-')
    //             .replace(/\//g, '_')
    //             .replace(/\=/g, '');
    //     } else if (isPlatformBrowser(this.platformId)) {
    //         // ✅ Client-side HMAC (Web Crypto API) if iframe URL not hydrated
    //         hash = await this.hmacSha256UrlSafeBrowser(this.baseUrl, this.key);
    //     } else {
    //         // fallback
    //         hash = '';
    //     }

    //     const finalUrl = `${this.baseUrl}&app_uid=${this.appUid}&hash=${hash}`;
    //     this.iframeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(finalUrl);
    // }


    /** Browser-side HMAC SHA256 using Web Crypto API */
    private async hmacSha256UrlSafeBrowser(source: string, key: string): Promise<string> {
        const enc = new TextEncoder();
        const keyBytes = enc.encode(key);
        const sourceBytes = enc.encode(source);

        const cryptoKey = await crypto.subtle.importKey(
            'raw',
            keyBytes,
            { name: 'HMAC', hash: 'SHA-256' },
            false,
            ['sign']
        );

        const sig = await crypto.subtle.sign('HMAC', cryptoKey, sourceBytes);
        const base64 = this.arrayBufferToBase64(sig);
        return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
    }

    /** ArrayBuffer → Base64 */
    private arrayBufferToBase64(buffer: ArrayBuffer): string {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        for (let i = 0; i < bytes.length; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return btoa(binary);
    }

}
