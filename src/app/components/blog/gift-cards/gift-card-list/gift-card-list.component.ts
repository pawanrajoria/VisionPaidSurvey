import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap, tap } from 'rxjs';
import { GiftCardCategory, GiftCardSummary } from '../gift-card.model';
import { BlogGiftCardService } from '../gift-card.service';
import { BlogSeoService } from '../../seo.service';


const CATEGORIES: { value: GiftCardCategory; label: string; icon: string }[] = [
  { value: 'gaming', label: 'Gaming', icon: 'sports_esports' },
  { value: 'shopping', label: 'Shopping', icon: 'shopping_bag' },
  { value: 'streaming', label: 'Streaming', icon: 'live_tv' },
  { value: 'food-delivery', label: 'Food Delivery', icon: 'delivery_dining' },
  { value: 'crypto', label: 'Crypto', icon: 'currency_bitcoin' },
  { value: 'prepaid-visa', label: 'Prepaid Visa', icon: 'credit_card' },
  { value: 'travel', label: 'Travel', icon: 'flight' },
];

@Component({
  selector: 'pp-gift-card-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatIconModule, MatButtonModule,
    MatButtonToggleModule, MatPaginatorModule, MatProgressSpinnerModule,
  ],
  templateUrl: './gift-card-list.component.html',
  styleUrl: './gift-card-list.component.scss',
})
export class GiftCardListComponent implements OnInit {
  private readonly giftCardService = inject(BlogGiftCardService);
  private readonly seo = inject(BlogSeoService);
  private readonly route = inject(ActivatedRoute);

  readonly categories = CATEGORIES;
  readonly cards = signal<GiftCardSummary[]>([]);
  readonly totalItems = signal(0);
  readonly pageSize = signal(30);
  readonly pageIndex = signal(0);
  readonly loading = signal(true);
  readonly activeCategory = signal<GiftCardCategory | null>(null);
  readonly sort = signal<'popular' | 'rating' | 'az'>('popular');

  readonly heading = computed(() => {
    const cat = this.categories.find(c => c.value === this.activeCategory());
    return cat ? `${cat.label} Gift Cards` : 'All Gift Cards';
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(params => {
          this.activeCategory.set((params.get('category') as GiftCardCategory) ?? null);
          this.pageIndex.set(0);
        }),
        switchMap(() => this.fetch())
      )
      .subscribe(result => {
        this.cards.set(result.items);
        this.totalItems.set(result.totalItems);
        this.loading.set(false);
      });

    this.seo.apply({
      title: this.heading(),
      description: 'Redeem your ProfitPiller points for gift cards across gaming, shopping, streaming, food delivery and crypto brands.',
      canonicalPath: this.route.snapshot.url.length ? `/${this.route.snapshot.url.join('/')}` : '/gift-cards',
    });
  }

  private fetch() {
    return this.giftCardService.list({
      page: this.pageIndex() + 1,
      pageSize: this.pageSize(),
      category: this.activeCategory() ?? undefined,
      sort: this.sort(),
    });
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loading.set(true);
    this.fetch().subscribe(result => {
      this.cards.set(result.items);
      this.totalItems.set(result.totalItems);
      this.loading.set(false);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  onSortChange(sort: 'popular' | 'rating' | 'az'): void {
    this.sort.set(sort);
    this.loading.set(true);
    this.fetch().subscribe(result => {
      this.cards.set(result.items);
      this.totalItems.set(result.totalItems);
      this.loading.set(false);
    });
  }

  minPrice(card: GiftCardSummary): number {
    return Math.min(...card.denominations.map(d => d.amount));
  }

  maxPrice(card: GiftCardSummary): number {
    return Math.max(...card.denominations.map(d => d.amount));
  }

  trackBySlug(_: number, card: GiftCardSummary): string {
    return card.slug;
  }
}
