import { Injectable, Inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { SUPPORTED_LOCALES } from './country-langiuage-list';
import { BRAND_NAME, DEFAULT_OG_IMAGE, SITE_URL, absoluteUrl } from './site.config';

export interface PageSeo {
    title: string;
    description: string;
    /** Absolute canonical URL. */
    url: string;
    image?: string;
    /** URL locale slug, e.g. "en-us". */
    locale?: string;
    keywords?: string[];
    /** false for private / utility pages (app, admin, auth callbacks, survey flow). */
    indexable?: boolean;
}

@Injectable({ providedIn: 'root' })
export class SeoService {

    constructor(
        private titleService: Title,
        private metaService: Meta,
        @Inject(DOCUMENT) private document: Document
    ) {
    }

    /** "en-us" -> "en_US" (the format Open Graph expects). */
    private ogLocale(locale: string): string {
        const [lang, region] = locale.split('-');
        return region ? `${lang.toLowerCase()}_${region.toUpperCase()}` : lang.toLowerCase();
    }

    apply(page: PageSeo): void {
        const locale = page.locale || 'en-us';
        const image = page.image || DEFAULT_OG_IMAGE;
        const indexable = page.indexable !== false;

        this.titleService.setTitle(page.title);

        this.metaService.updateTag({ name: 'description', content: page.description });
        this.metaService.updateTag({
            name: 'robots',
            content: indexable ? 'index,follow,max-image-preview:large,max-snippet:-1' : 'noindex,nofollow'
        });

        if (page.keywords?.length) {
            this.metaService.updateTag({ name: 'keywords', content: page.keywords.join(', ') });
        } else {
            this.metaService.removeTag('name="keywords"');
        }

        this.metaService.updateTag({ property: 'og:title', content: page.title });
        this.metaService.updateTag({ property: 'og:description', content: page.description });
        this.metaService.updateTag({ property: 'og:url', content: page.url });
        this.metaService.updateTag({ property: 'og:type', content: 'website' });
        this.metaService.updateTag({ property: 'og:image', content: image });
        this.metaService.updateTag({ property: 'og:image:width', content: '1200' });
        this.metaService.updateTag({ property: 'og:image:height', content: '630' });
        this.metaService.updateTag({ property: 'og:site_name', content: BRAND_NAME });
        this.metaService.updateTag({ property: 'og:locale', content: this.ogLocale(locale) });

        // Earlier builds emitted ~100 og:locale:alternate tags on every page; hreflang
        // already tells crawlers about the language versions, so they are no longer written.
        this.document?.head
            .querySelectorAll('meta[property="og:locale:alternate"]')
            .forEach(x => x.remove());

        this.metaService.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
        this.metaService.updateTag({ name: 'twitter:title', content: page.title });
        this.metaService.updateTag({ name: 'twitter:description', content: page.description });
        this.metaService.updateTag({ name: 'twitter:image', content: image });

        this.updateCanonical(page.url);
    }

    /** Kept for existing callers. */
    updateMetaData(
        title: string,
        description: string,
        url?: string,
        image?: string,
        locale: string = 'en-us'
    ): void {
        this.apply({ title, description, url: url || SITE_URL, image, locale });
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

    /** Writes one <link rel="alternate" hreflang> per supported locale, or none for non-indexable pages. */
    updateHreflang(cleanPath: string, _activeLocale?: string, enabled: boolean = true): void {
        if (!this.document) return;

        this.document.head
            .querySelectorAll<HTMLLinkElement>('link[rel="alternate"][hreflang]')
            .forEach(el => el.remove());

        if (!enabled) return;

        const path = !cleanPath || cleanPath === '/' ? '' : cleanPath.startsWith('/') ? cleanPath : `/${cleanPath}`;
        const processed = new Set<string>();

        for (const locale of SUPPORTED_LOCALES) {
            const key = locale.hreflang.toLowerCase();
            if (processed.has(key)) continue;
            processed.add(key);

            const link = this.document.createElement('link');
            link.rel = 'alternate';
            link.hreflang = locale.hreflang;
            link.href = absoluteUrl(`/${locale.urlPrefix}${path}`);
            this.document.head.appendChild(link);
        }
    }
}
