import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { DOCUMENT } from '@angular/common';

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
  private readonly siteUrl = 'https://profitpiller.com';

  apply(data: SeoData): void {
    const fullTitle = data.title.length > 60 ? data.title : `${data.title} | ProfitPiller`;
    this.titleService.setTitle(fullTitle);

    this.setTag('name', 'description', data.description);
    this.setTag('property', 'og:title', fullTitle);
    this.setTag('property', 'og:description', data.description);
    this.setTag('property', 'og:type', data.type ?? 'website');
    this.setTag('property', 'og:url', `${this.siteUrl}${data.canonicalPath}`);
    if (data.image) this.setTag('property', 'og:image', data.image);

    this.setTag('name', 'twitter:card', data.image ? 'summary_large_image' : 'summary');
    this.setTag('name', 'twitter:title', fullTitle);
    this.setTag('name', 'twitter:description', data.description);

    this.setCanonical(`${this.siteUrl}${data.canonicalPath}`);

    if (data.jsonLd) {
      this.setJsonLd(data.jsonLd);
    }
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
      image: [opts.image],
      datePublished: opts.datePublished,
      dateModified: opts.dateModified,
      author: [{ '@type': 'Person', name: opts.authorName }],
      mainEntityOfPage: opts.url,
    };
  }

  productJsonLd(opts: {
    name: string; description: string; image: string; url: string;
    lowPrice: number; highPrice: number; currency: string;
    ratingValue: number; reviewCount: number;
  }) {
    return {
      '@context': 'https://schema.org',
      '@type': 'Product',
      name: opts.name,
      description: opts.description,
      image: [opts.image],
      url: opts.url,
      offers: {
        '@type': 'AggregateOffer',
        lowPrice: opts.lowPrice,
        highPrice: opts.highPrice,
        priceCurrency: opts.currency,
        offerCount: 1,
      },
      aggregateRating: {
        '@type': 'AggregateRating',
        ratingValue: opts.ratingValue,
        reviewCount: opts.reviewCount,
      },
    };
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
