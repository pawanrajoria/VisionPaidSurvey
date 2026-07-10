import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { SUPPORTED_LOCALES } from './country-langiuage-list';
const BASE_URL = 'https://profitpiller.com';

@Injectable({ providedIn: 'root' })
export class SeoService {
    constructor(
        private titleService: Title,
        private metaService: Meta,
        @Inject(DOCUMENT) private document: Document
    ) {
    }

    updateMetaData(
        title: string,
        description: string,
        url?: string,
        image?: string,
        locale: string = 'en-us'
    ): void {

        const currentUrl =
            url || (this.document?.location?.href ?? 'https://profitpiller.com');

        const imageUrl =
            image || 'https://profitpiller.com/assets/images/og-image.png';

        // Title
        this.titleService.setTitle(title);

        // Standard Meta
        this.metaService.updateTag({
            name: 'description',
            content: description
        });

        this.metaService.updateTag({
            name: 'robots',
            content: 'index,follow'
        });

        // Open Graph
        this.metaService.updateTag({
            property: 'og:title',
            content: title
        });

        this.metaService.updateTag({
            property: 'og:description',
            content: description
        });

        this.metaService.updateTag({
            property: 'og:url',
            content: currentUrl
        });

        this.metaService.updateTag({
            property: 'og:type',
            content: 'website'
        });

        this.metaService.updateTag({
            property: 'og:image',
            content: imageUrl
        });

        this.metaService.updateTag({
            property: 'og:site_name',
            content: 'ProfitPiller'
        });

        this.metaService.updateTag({
            property: 'og:image:width',
            content: '1200'
        });

        this.metaService.updateTag({
            property: 'og:image:height',
            content: '630'
        });

        // Current locale
        this.metaService.updateTag({
            property: 'og:locale',
            content: locale.replace('-', '_')
        });

        // Remove existing alternate locales
        this.document?.head
            .querySelectorAll('meta[property="og:locale:alternate"]')
            .forEach(x => x.remove());

        // Add alternate locales
        SUPPORTED_LOCALES
            .filter(x => x.hreflang !== 'x-default')
            .forEach(x => {

                const ogLocale = x.hreflang.replace('-', '_');

                if (
                    ogLocale.toLowerCase() ===
                    locale.replace('-', '_').toLowerCase()
                ) {
                    return;
                }

                const meta = this.document!.createElement('meta');

                meta.setAttribute('property', 'og:locale:alternate');
                meta.setAttribute('content', ogLocale);

                this.document!.head.appendChild(meta);
            });

        // Twitter
        this.metaService.updateTag({
            name: 'twitter:card',
            content: 'summary_large_image'
        });

        this.metaService.updateTag({
            name: 'twitter:title',
            content: title
        });

        this.metaService.updateTag({
            name: 'twitter:description',
            content: description
        });

        this.metaService.updateTag({
            name: 'twitter:image',
            content: imageUrl
        });

        this.metaService.updateTag({
            name: 'twitter:url',
            content: currentUrl
        });

        this.metaService.updateTag({
            name: 'twitter:site',
            content: '@ProfitPiller'
        });

        this.updateCanonical(currentUrl);
    }

    private updateCanonical(url: string): void {

        let link = this.document.head.querySelector<HTMLLinkElement>(
            'link[rel="canonical"]'
        );

        if (!link) {
            link = this.document.createElement('link');
            link.setAttribute('rel', 'canonical');
            this.document.head.appendChild(link);
        }

        link.setAttribute('href', url);
    }

    updateHreflang(cleanPath: string, activeLocale?: string): void {
        if (!this.document) return;

        // Normalise path
        const path = !cleanPath || cleanPath === '/' ? '' : cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;

        // Remove all existing hreflang links to avoid duplicates
        this.document.head
            .querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')
            .forEach(el => el.remove());

        const processed = new Set<string>();

        // Add hreflang links
        for (const locale of SUPPORTED_LOCALES) {
            if (processed.has(locale.hreflang.toLowerCase())) {
                continue;
            }

            processed.add(locale.hreflang.toLowerCase());

            const href =
                locale.hreflang === 'x-default'
                    ? `${BASE_URL}${path}`
                    : `${BASE_URL}/${locale.urlPrefix}${path}`;

            const link = this.document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = locale.hreflang;
            link.href = href;

            this.document.head.appendChild(link);
        }

        console.log(
            `[SEO] hreflang updated | locale=${activeLocale ?? 'unknown'} | path=${path}`
        );
    }

    // private setCanonicalURL(url: string) {
    //     if (!this.isBrowser) return;

    //     let link: HTMLLinkElement = this.document.querySelector("link[rel='canonical']")
    //         || this.document.createElement('link');
    //     link.setAttribute('rel', 'canonical');
    //     link.setAttribute('href', url);

    //     if (!link.parentNode) {
    //         this.document.head.appendChild(link);
    //     }
    // }
}
