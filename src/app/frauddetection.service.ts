import { Injectable, Inject, PLATFORM_ID, Optional } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { ReCaptchaV3Service } from 'ng-recaptcha';
import { ConfigService } from './config.service';
import { firstValueFrom } from 'rxjs';
import * as CryptoJS from 'crypto-js';

@Injectable({ providedIn: 'root' })
export class FraudService {
    private mouseMoves = 0;
    private clicks = 0;
    private scrolls = 0;
    private trackingStarted = false;
    private fpPromise: any;
    private readonly key = "a0f3dc257c884e299dfdde9088e6e0c9";

    constructor(
        private http: HttpClient,
        private config: ConfigService,
        // Optional because Recaptcha might not load in SSR
        @Optional() private recaptcha: ReCaptchaV3Service,
        @Inject(PLATFORM_ID) private platformId: Object,
        @Inject(DOCUMENT) private document: Document
    ) {
        // Initialize FingerprintJS only in the browser
        if (isPlatformBrowser(this.platformId)) {
            this.initFingerprint();
        }
    }

    private async initFingerprint() {
        // Dynamic import to prevent SSR from trying to parse the library
        const FingerprintJS = await import('@fingerprintjs/fingerprintjs');
        this.fpPromise = FingerprintJS.load();
    }

    startTracking() {
        if (!isPlatformBrowser(this.platformId) || this.trackingStarted) return;

        this.trackingStarted = true;
        // Use document from Inject(DOCUMENT) for better SSR safety
        this.document.addEventListener('mousemove', () => this.mouseMoves++);
        this.document.addEventListener('click', () => this.clicks++);
        this.document.addEventListener('scroll', () => this.scrolls++);
    }

    resetTracking() {
        this.mouseMoves = 0;
        this.clicks = 0;
        this.scrolls = 0;
    }

    async collectSignals() {
        if (!isPlatformBrowser(this.platformId) || !this.fpPromise) return null;

        const windowRef = this.document.defaultView;
        if (!windowRef) return null;

        try {
            const fp = await this.fpPromise;
            const result = await fp.get();

            // Modern way to handle Observables as Promises in Angular
            const token = await firstValueFrom(this.recaptcha.execute('survey_action'));

            const payload = {
                fingerprint: result.visitorId,
                browser: windowRef.navigator.userAgent,
                os: this.getOS(),
                screen: `${windowRef.screen.width}x${windowRef.screen.height}`,
                timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
                mouseMoves: this.mouseMoves,
                clicks: this.clicks,
                scrolls: this.scrolls,
                recaptchaToken: token,
                duid: this.fetchDuid()
            };

            return firstValueFrom(this.http.post(`${this.config.baseUrl}account/check`, payload));
        } catch (error) {
            console.error('Fraud signal collection failed', error);
            return null;
        }
    }

    getOS(): string {
        if (!isPlatformBrowser(this.platformId)) return 'SSR';

        const userAgent = this.document.defaultView?.navigator.userAgent || '';
        if (/Win/.test(userAgent)) return 'Windows';
        if (/Mac/.test(userAgent)) return 'MacOS';
        if (/Linux/.test(userAgent)) return 'Linux';
        if (/Android/.test(userAgent)) return 'Android';
        if (/like Mac/.test(userAgent)) return 'iOS';

        return 'Unknown';
    }

    fetchDuid(): string {
        if (!isPlatformBrowser(this.platformId)) return "";

        const duid = localStorage.getItem('Duid');
        const appToken = localStorage.getItem('AppToken');

        if (!duid || duid.length !== 32 || !appToken) return "";

        try {
            const bytes = CryptoJS.AES.decrypt(appToken, this.key);
            const decryptedDuid = bytes.toString(CryptoJS.enc.Utf8);
            return duid === decryptedDuid ? duid : "";
        } catch {
            return "";
        }
    }

    async setDuid() {
        if (!isPlatformBrowser(this.platformId) || !this.fpPromise) return;

        const fp = await this.fpPromise;
        const result = await fp.get();
        const duid = result.visitorId;

        if (duid) {
            localStorage.setItem('Duid', duid);
            const encrypted = CryptoJS.AES.encrypt(duid, this.key).toString();
            localStorage.setItem('AppToken', encrypted);
        }
    }
}