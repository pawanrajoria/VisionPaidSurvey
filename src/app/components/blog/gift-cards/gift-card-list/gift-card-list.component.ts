import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap, tap } from 'rxjs';
import { GiftCardCategory, GiftCardSummary } from '../gift-card.model';
import { BlogGiftCardService } from '../gift-card.service';
import { BlogSeoService } from '../../seo.service';
import { CoverArtComponent } from '../../cover-art/cover-art.component';
import { giftCardCategoryImage } from '../gift-card-content.generator';
import { routeLocale, seedFromId } from '../../locale';
import { giftCardAmount, giftCardAmountLabel } from '../gift-card-format';


const CATEGORIES: { value: GiftCardCategory; label: string; icon: string }[] = [
  { value: 'shopping', label: 'Shopping', icon: 'shopping_bag' },
  { value: 'gaming', label: 'Gaming', icon: 'sports_esports' },
  { value: 'streaming', label: 'Streaming & Apps', icon: 'live_tv' },
  { value: 'food-delivery', label: 'Food & Delivery', icon: 'delivery_dining' },
  { value: 'prepaid-visa', label: 'Prepaid Cards', icon: 'credit_card' },
  { value: 'travel', label: 'Travel', icon: 'flight' },
  { value: 'crypto', label: 'Crypto', icon: 'currency_bitcoin' },
];

type SortKey = 'popular' | 'az';

@Component({
  selector: 'pp-gift-card-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule,
    CoverArtComponent,
  ],
  templateUrl: './gift-card-list.component.html',
  styleUrl: './gift-card-list.component.scss',
})
export class GiftCardListComponent implements OnInit {
  private readonly giftCardService = inject(BlogGiftCardService);
  private readonly seo = inject(BlogSeoService);
  private readonly route = inject(ActivatedRoute);

  readonly categories = CATEGORIES;
  readonly locale = routeLocale(this.route);
  readonly cards = signal<GiftCardSummary[]>([]);
  readonly totalItems = signal(0);
  readonly pageSize = signal(30);
  readonly pageIndex = signal(0);
  readonly loading = signal(true);
  readonly activeCategory = signal<GiftCardCategory | null>(null);
  readonly sort = signal<SortKey>('popular');

  readonly heading = computed(() => {
    const cat = this.categories.find(c => c.value === this.activeCategory());
    return cat ? `${cat.label} gift cards` : 'Gift card rewards';
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(params => {
          this.activeCategory.set((params.get('category') as GiftCardCategory) ?? null);
          this.pageIndex.set(0);
          this.loading.set(true);
        }),
        switchMap(() => this.fetch())
      )
      .subscribe(result => {
        this.cards.set(result.items);
        this.totalItems.set(result.totalItems);
        this.loading.set(false);
        this.applySeo();
      });
  }

  private applySeo(): void {
    const cat = this.activeCategory();
    this.seo.apply({
      title: `${this.heading()} - Redeem Profitpiller Points`,
      description: 'Turn the points you earn from surveys, offers and offer walls on Profitpiller into gift cards from brands like Amazon, Visa and Google Play. Cash-outs start at $5.',
      canonicalPath: this.route.snapshot.url.length
        ? `/gift-cards/${this.route.snapshot.url.map(s => s.path).join('/')}`
        : '/gift-cards',
      image: giftCardCategoryImage(cat ?? 'shopping'),
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
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  onSortChange(sort: SortKey): void {
    if (sort === this.sort()) return;
    this.sort.set(sort);
    this.loading.set(true);
    this.fetch().subscribe(result => {
      this.cards.set(result.items);
      this.totalItems.set(result.totalItems);
      this.loading.set(false);
    });
  }

  amount(card: GiftCardSummary): string {
    return giftCardAmountLabel(giftCardAmount(card), card.denominations[0]?.currency ?? 'USD');
  }

  categoryLabel(category: GiftCardCategory): string {
    return this.categories.find(c => c.value === category)?.label ?? category;
  }

  seed(card: GiftCardSummary): number {
    return seedFromId(card.id);
  }

  trackBySlug(_: number, card: GiftCardSummary): string {
    return card.slug;
  }
}
