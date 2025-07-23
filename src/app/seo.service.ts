// seo.service.ts
import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class SeoService {
    constructor(
        private titleService: Title,
        private metaService: Meta,
        @Inject(DOCUMENT) private document: Document
    ) { }

    updateMetaData(title: string, description: string, url?: string, image?: string) {
        const currentUrl = url || this.document.location.href;
        const imageUrl = image || 'https://profitpiller.com/assets/images/og-image.png';

        this.titleService.setTitle(title);

        this.metaService.updateTag({ name: 'description', content: description });

        // Canonical URL
        this.setCanonicalURL(currentUrl);

        // Open Graph
        this.metaService.updateTag({ property: 'og:title', content: title });
        this.metaService.updateTag({ property: 'og:description', content: description });
        this.metaService.updateTag({ property: 'og:url', content: currentUrl });
        this.metaService.updateTag({ property: 'og:type', content: 'website' });
        this.metaService.updateTag({ property: 'og:image', content: imageUrl });

        // Twitter Card
        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({ name: 'twitter:title', content: title });
        this.metaService.updateTag({ name: 'twitter:description', content: description });
        this.metaService.updateTag({ name: 'twitter:image', content: imageUrl });
        this.metaService.updateTag({ name: 'twitter:site', content: '@Profitpiller' });
    }

    private setCanonicalURL(url: string) {
        let link: HTMLLinkElement = this.document.querySelector("link[rel='canonical']") || this.document.createElement('link');
        link.setAttribute('rel', 'canonical');
        link.setAttribute('href', url);
        if (!link.parentNode) {
            this.document.head.appendChild(link);
        }
    }
}
