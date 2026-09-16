import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { Paginated } from '../blog.service';
import { GiftCard, GiftCardCategory, GiftCardSummary } from './gift-card.model';
import {
  listGiftCardSummaries, getGiftCardBySlug, listGiftCardCategories,
} from './gift-card-content.generator';

/**
 * Zero-storage: every gift card page is computed on the fly by
 * gift-card-content.generator.ts from its numeric position (brand x
 * denomination x region x occasion, via deterministic modular
 * arithmetic) - no JSON files, no API, no database.
 */
@Injectable({ providedIn: 'root' })
export class BlogGiftCardService {
  list(opts: {
    page?: number; pageSize?: number; category?: GiftCardCategory; sort?: 'popular' | 'rating' | 'az';
  } = {}): Observable<Paginated<GiftCardSummary>> {
    const page = opts.page ?? 1;
    const pageSize = opts.pageSize ?? 30;
    const { items, totalItems, totalPages } = listGiftCardSummaries({
      page, pageSize, category: opts.category, sort: opts.sort,
    });
    return of({ items, page, pageSize, totalItems, totalPages });
  }

  getBySlug(slug: string): Observable<GiftCard> {
    const card = getGiftCardBySlug(slug);
    if (!card) {
      return new Observable<GiftCard>(sub => sub.error(new Error(`No gift card for slug "${slug}"`)));
    }
    return of(card);
  }

  getCategories(): Observable<{ category: GiftCardCategory; label: string; count: number }[]> {
    return of(listGiftCardCategories());
  }
}
