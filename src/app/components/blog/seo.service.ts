import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';
import { NavigationCancel, NavigationEnd, NavigationError, Router } from '@angular/router';
import { filter, take } from 'rxjs';
import { BRAND_NAME, SITE_URL } from '../../site.config';

export interface SeoData {
  title: string;
  description: string;
  canonicalPath: string;   // e.g. '/blog/best-receipt-scanning-apps'
  image?: string;
  type?: 'article' | 'website' | 'product';
  publishedAt?: string;
  updatedAt?: string;
  jsonLd?: Record<string, unknown> | Record<string, unknown>[];
}

/**
 * Central place that sets <title>, meta tags, canonical link and
 * JSON-LD structured data for every dynamically generated page.
 * With 100k+ near-duplicate template pages, this service is what
 * keeps every page individually indexable instead of getting
 * collapsed as duplicate content by search engines:
 *  - unique <title> / meta description per slug
 *  - self-referencing canonical (prevents index bloat / duplicate flags)
 *  - Article / Product structured data for rich results
 */
@Injectable({ providedIn: 'root' })
export class BlogSeoService {
  private readonly meta = inject(Meta);
  private readonly titleService = inject(Title);
  private readonly doc = inject(DOCUMENT);
  private readonly router = inject(Router);
  private readonly siteUrl = SITE_URL;

  /** Site-relative asset path -> absolute URL (og:image must be absolute). */
  absoluteImage(path: string): string {
    return /^https?:\/\//.test(path) ? path : `${this.siteUrl}/${path.replace(/^\/+/, '')}`;
  }

  apply(data: SeoData): void {
    const fullTitle = data.title.length > 60 ? data.title : `${data.title} | ${BRAND_NAME}`;
    this.titleService.setTitle(fullTitle);

    this.setTag('name', 'description', data.description);
    this.setTag('property', 'og:title', fullTitle);
    this.setTag('property', 'og:description', data.description);
    this.setTag('property', 'og:type', data.type ?? 'website');
    this.setTag('property', 'og:url', `${this.siteUrl}${data.canonicalPath}`);
    if (data.image) {
      const image = this.absoluteImage(data.image);
      this.setImage(image);
      // The app-wide SeoService re-applies defaults (including the default
      // og:image) on NavigationEnd. When we run mid-navigation, set the page
      // image again once that navigation has finished so ours wins.
      if (this.router.getCurrentNavigation()) {
        this.router.events
          .pipe(
            filter(e => e instanceof NavigationEnd || e instanceof NavigationCancel || e instanceof NavigationError),
            take(1),
          )
          .subscribe(e => { if (e instanceof NavigationEnd) this.setImage(image); });
      }
    }

    this.setTag('name', 'twitter:card', data.image ? 'summary_large_image' : 'summary');
    this.setTag('name', 'twitter:title', fullTitle);
    this.setTag('name', 'twitter:description', data.description);

    this.setCanonical(`${this.siteUrl}${data.canonicalPath}`);

    if (data.jsonLd) {
      this.setJsonLd(data.jsonLd);
    }
  }

  private setImage(image: string): void {
    this.setTag('property', 'og:image', image);
    this.setTag('property', 'og:image:width', '1200');
    this.setTag('property', 'og:image:height', '630');
    this.setTag('name', 'twitter:image', image);
  }

  private setTag(attr: 'name' | 'property', key: string, content: string): void {
    this.meta.updateTag({ [attr]: key, content } as any);
  }

  private setCanonical(url: string): void {
    let link: HTMLLinkElement | null = this.doc.querySelector('link[rel="canonical"]');
    if (!link) {
      link = this.doc.createElement('link');
      link.setAttribute('rel', 'canonical');
      this.doc.head.appendChild(link);
    }
    link.setAttribute('href', url);
  }

  private setJsonLd(data: Record<string, unknown> | Record<string, unknown>[]): void {
    const existing = this.doc.getElementById('pp-jsonld');
    if (existing) existing.remove();

    const script = this.doc.createElement('script');
    script.id = 'pp-jsonld';
    script.type = 'application/ld+json';
    script.text = JSON.stringify(data);
    this.doc.head.appendChild(script);
  }

  articleJsonLd(opts: {
    headline: string; description: string; image: string;
    datePublished: string; dateModified: string; authorName: string; url: string;
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: opts.headline,
      description: opts.description,
      image: [this.absoluteImage(opts.image)],
      datePublished: opts.datePublished,
      dateModified: opts.dateModified,
      author: [{ '@type': 'Organization', name: opts.authorName, url: this.siteUrl || undefined }],
      publisher: { '@type': 'Organization', name: BRAND_NAME },
      mainEntityOfPage: opts.url,
    };
  }

  /**
   * Product markup for a gift-card page. Rating and price data are optional and
   * only emitted when real values are supplied - never invent reviews.
   */
  productJsonLd(opts: {
    name: string; description: string; image: string; url: string; brand?: string;
    lowPrice?: number; highPrice?: number; currency?: string;
    ratingValue?: number; reviewCount?: number;
  }) {
    const data: Record<string, unknown> = {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: opts.name,
      description: opts.description,
      image: [this.absoluteImage(opts.image)],
      url: opts.url,
    };
    if (opts.brand) data['brand'] = { '@type': 'Brand', name: opts.brand };
    if (opts.lowPrice != null && opts.highPrice != null && opts.currency) {
      data['offers'] = {
        '@type': 'AggregateOffer',
        lowPrice: opts.lowPrice,
        highPrice: opts.highPrice,
        priceCurrency: opts.currency,
        offerCount: 1,
      };
    }
    if (opts.ratingValue && opts.reviewCount) {
      data['aggregateRating'] = {
        '@type': 'AggregateRating',
        ratingValue: opts.ratingValue,
        reviewCount: opts.reviewCount,
      };
    }
    return data;
  }

  breadcrumbJsonLd(items: { name: string; url: string }[]) {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: items.map((item, i) => ({
        '@type': 'ListItem',
        position: i + 1,
        name: item.name,
        item: item.url,
      })),
    };
  }
}
