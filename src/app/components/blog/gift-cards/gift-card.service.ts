import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, shareReplay } from 'rxjs';
import { Paginated } from '../blog.service';
import { GiftCard, GiftCardCategory, GiftCardSummary } from './gift-card.model';

@Injectable({ providedIn: 'root' })
export class BlogGiftCardService {
  private readonly http = inject(HttpClient);

  readonly useStaticShards = true;
  private readonly apiBase = '/api/gift-cards';
  private readonly shardBase = '/assets/data/gift-cards';

  private readonly cache = new Map<string, Observable<Paginated<GiftCardSummary>>>();

  list(opts: {
    page?: number; pageSize?: number; category?: GiftCardCategory; sort?: 'popular' | 'rating' | 'az';
  } = {}): Observable<Paginated<GiftCardSummary>> {
    const page = opts.page ?? 1;
    const pageSize = opts.pageSize ?? 30;
    const key = JSON.stringify({ ...opts, page, pageSize });

    if (!this.cache.has(key)) {
      const request$ = this.useStaticShards
        ? this.http.get<Paginated<GiftCardSummary>>(
            `${this.shardBase}/index/${opts.category ?? 'all'}-page-${page}.json`
          )
        : this.http.get<Paginated<GiftCardSummary>>(`${this.apiBase}`, {
            params: {
              page, pageSize,
              ...(opts.category ? { category: opts.category } : {}),
              ...(opts.sort ? { sort: opts.sort } : {}),
            } as any,
          });
      this.cache.set(key, request$.pipe(shareReplay(1)));
    }
    return this.cache.get(key)!;
  }

  getBySlug(slug: string): Observable<GiftCard> {
    return this.useStaticShards
      ? this.http.get<GiftCard>(`${this.shardBase}/${slug}.json`)
      : this.http.get<GiftCard>(`${this.apiBase}/${slug}`);
  }

  getCategories(): Observable<{ category: GiftCardCategory; label: string; count: number }[]> {
    return this.http.get<{ category: GiftCardCategory; label: string; count: number }[]>(
      `${this.shardBase}/index/categories.json`
    );
  }
}
