import { inject } from '@angular/core';
import { BrowserService } from './browser.service';
import { UserService } from './components/layout/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { LOCALE_COUNTRY_MAP, SUPPORTED_LOCALE_CODES } from './country-langiuage-list';

export abstract class BaseComponent {
    protected readonly browserService = inject(BrowserService);
    protected win: Window | null = null;
    protected nav: Navigator | null = null;
    protected doc: Document | null = null;
    protected isBrowser: boolean = false;

    readonly userService = inject(UserService);
    readonly activateRoutelang = inject(ActivatedRoute);
    // readonly currentLang = this.getLangFromRoute(this.activateRoutelang);
    readonly currentLocale = this.getLocaleFromRoute(this.activateRoutelang);

    constructor() {
        this.bindBrowserSetting(); // ✅ safe in constructor
    }

    protected bindBrowserSetting(): void {
        this.isBrowser = this.browserService.isPlatformBrowser;
        if (this.isBrowser) {
            this.win = this.browserService.window;
            this.nav = this.browserService.navigator;
            this.doc = this.browserService.document;
        }
    }

    async logUserActivity(pageName: string, eventName: string, status: string, remarks: string) {
        await this.userService.logActivity({ eventName: eventName, pageName: pageName, status: status, remarks: remarks });
    }


    private getLangFromRoute(route: ActivatedRoute): string {
        let current: ActivatedRoute | null = route;

        while (current) {
            const lang = current.snapshot.paramMap.get('lang');
            if (lang) return lang;
            current = current.parent;
        }

        return 'en'; // fallback
    }

    private getLocaleFromRoute(route: ActivatedRoute): string {

        let current: ActivatedRoute | null = route;

        while (current) {
            const locale = current.snapshot.paramMap.get('locale');

            if (locale && SUPPORTED_LOCALE_CODES.has(locale.toLowerCase())) {
                return locale.toLowerCase();
            }

            current = current.parent;
        }

        // No locale in URL -> use browser locale
        const browserLocale = navigator.language
            .toLowerCase()
            .replace('_', '-');

        if (SUPPORTED_LOCALE_CODES.has(browserLocale)) {
            return browserLocale;
        }

        const baseLang = browserLocale.split('-')[0];

        if (LOCALE_COUNTRY_MAP[baseLang]) {
            return `${baseLang}-${LOCALE_COUNTRY_MAP[baseLang]}`;
        }

        return 'en-us';
    }

    // private getCurrentLocale(): string {

    //     // URL has highest priority
    //     const urlLocale = this.router.url.split('/')[1]?.toLowerCase();

    //     if (urlLocale && SUPPORTED_LOCALE_CODES.has(urlLocale)) {
    //         return urlLocale;
    //     }

    //     // Stored locale
    //     const storedLocale = localStorage.getItem('locale');
    //     if (storedLocale && SUPPORTED_LOCALE_CODES.has(storedLocale)) {
    //         return storedLocale;
    //     }

    //     // Browser locale
    //     const browserLocale = navigator.language
    //         .toLowerCase()
    //         .replace('_', '-');

    //     if (SUPPORTED_LOCALE_CODES.has(browserLocale)) {
    //         return browserLocale;
    //     }

    //     // Convert "en" -> "en-us", "es" -> "es-es"
    //     const baseLang = browserLocale.split('-')[0];

    //     if (LOCALE_COUNTRY_MAP[baseLang]) {
    //         return `${baseLang}-${LOCALE_COUNTRY_MAP[baseLang]}`;
    //     }

    //     return 'en-us';
    // }

}
