import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
    private isBrowser: boolean;

    constructor(
        private titleService: Title,
        private metaService: Meta,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        this.isBrowser = isPlatformBrowser(this.platformId);
    }

    updateMetaData(title: string, description: string, url?: string, image?: string) {
        if (!this.isBrowser) return;

        const currentUrl = url || this.document.location.href;
        const imageUrl = image || 'https://profitpiller.com/assets/images/og-image.png';

        // Set Title and Description
        this.titleService.setTitle(title);
        this.metaService.updateTag({ name: 'description', content: description });

        // Canonical
        this.setCanonicalURL(currentUrl);

        // Open Graph
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
        this.metaService.updateTag({ property: 'og:url', content: currentUrl });
        this.metaService.updateTag({ property: 'og:type', content: 'website' });
        this.metaService.updateTag({ property: 'og:image', content: imageUrl });

        // Twitter Cards
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({ name: 'twitter:title', content: title });
        this.metaService.updateTag({ name: 'twitter:description', content: description });
        this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
        this.metaService.updateTag({ name: 'twitter:site', content: '@Profitpiller' });
    }

    private setCanonicalURL(url: string) {
        if (!this.isBrowser) return;

        let link: HTMLLinkElement = this.document.querySelector("link[rel='canonical']")
            || this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', url);

        if (!link.parentNode) {
            this.document.head.appendChild(link);
        }
    }
}
