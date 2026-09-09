import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map, shareReplay } from 'rxjs';
import { BlogCategory, BlogPost, BlogPostSummary } from './blog-post.model';

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Data access for blog/guide content.
 *
 * SCALING NOTE (read this before wiring to production):
 * At 1,00,000+ pages you should NOT ship one giant JSON file.
 * Two supported patterns:
 *
 *  1. Real API (recommended): point `apiBase` at a backend/CMS
 *     (Strapi, a Node/Express service, Firestore, etc.) that
 *     supports ?page=&pageSize=&category= and GET /posts/:slug.
 *
 *  2. Static "sharded JSON" (zero backend, works on any static
 *     host / CDN): `scripts/generate-content.js` writes one JSON
 *     file per post under /assets/data/blog/<slug>.json plus
 *     paginated index files under /assets/data/blog/index/page-N.json.
 *     This service already knows how to read that shape — see
 *     `useStaticShards`.
 */
@Injectable({ providedIn: 'root' })
export class BlogService {
  private readonly http = inject(HttpClient);

  /** Flip to false once a real API is available. */
  readonly useStaticShards = false;
  private readonly apiBase = '/api/blog/posts';
  private readonly shardBase = '/assets/data/blog';

  private readonly categoryCache = new Map<string, Observable<Paginated<BlogPostSummary>>>();

  list(opts: { page?: number; pageSize?: number; category?: BlogCategory; tag?: string } = {}):
    Observable<Paginated<BlogPostSummary>> {
    const page = opts.page ?? 1;
    const pageSize = opts.pageSize ?? 24;
    const cacheKey = JSON.stringify({ ...opts, page, pageSize });

    if (!this.categoryCache.has(cacheKey)) {
      const request$ = this.useStaticShards
        ? this.http.get<Paginated<BlogPostSummary>>(
            `${this.shardBase}/index/${opts.category ?? 'all'}-page-${page}.json`
          )
        : this.http.get<Paginated<BlogPostSummary>>(`${this.apiBase}/posts`, {
            params: {
              page, pageSize,
              ...(opts.category ? { category: opts.category } : {}),
              ...(opts.tag ? { tag: opts.tag } : {}),
            } as any,
          });

      this.categoryCache.set(cacheKey, request$.pipe(shareReplay(1)));
    }
    return this.categoryCache.get(cacheKey)!;
  }

  getBySlug(slug: string): Observable<BlogPost> {
    return this.useStaticShards
      ? this.http.get<BlogPost>(`${this.shardBase}/${slug}.json`)
      : this.http.get<BlogPost>(`${this.apiBase}/posts/${slug}`);
  }

  getRelated(slugs: string[]): Observable<BlogPostSummary[]> {
    // Static-shard mode: fetch the individual shards and project
    // down to the summary shape used on cards.
    if (!slugs.length) return new Observable(sub => { sub.next([]); sub.complete(); });
    return this.http
      .get<BlogPost[]>(`${this.apiBase}/posts/batch`, { params: { slugs: slugs.join(',') } as any })
      .pipe(map(posts => posts.map(({ content, relatedSlugs, ...rest }) => rest)));
  }

  search(query: string): Observable<BlogPostSummary[]> {
    return this.http.get<BlogPostSummary[]>(`${this.apiBase}/search`, { params: { q: query } as any });
  }
}
