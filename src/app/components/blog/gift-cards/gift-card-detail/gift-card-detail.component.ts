import { SITE_URL } from '../../../../site.config';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap } from 'rxjs';
import { BlogGiftCardService } from '../gift-card.service';
import { BlogSeoService } from '../../seo.service';
import { GiftCard, GiftCardCategory, GiftCardDenomination, GiftCardSummary } from '../gift-card.model';
import { CoverArtComponent } from '../../cover-art/cover-art.component';
import { coverLabelFor } from '../../cover-art/cover-art';
import { PLAY_STORE_URL, routeLocale, seedFromId } from '../../locale';
import { giftCardAmount, giftCardAmountLabel } from '../gift-card-format';

/** Ways to earn the points a gift card is redeemed with. */
const EARN_WAYS = [
  { icon: 'assignment', title: 'Paid surveys', text: 'Share your opinion in surveys matched to your profile.' },
  { icon: 'local_offer', title: 'Offers', text: 'Try apps, games and sign-ups that pay points on completion.' },
  { icon: 'view_module', title: 'Offer walls', text: 'Browse partner walls with hundreds of extra tasks.' },
  { icon: 'local_fire_department', title: 'Daily streak', text: 'Keep a streak going to unlock badges and milestones.' },
];

@Component({
  selector: 'pp-gift-card-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatIconModule, MatExpansionModule, MatProgressSpinnerModule,
    CoverArtComponent,
  ],
  templateUrl: './gift-card-detail.component.html',
  styleUrl: './gift-card-detail.component.scss',
})
export class GiftCardDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly giftCardService = inject(BlogGiftCardService);
  private readonly seo = inject(BlogSeoService);

  readonly locale = routeLocale(this.route);
  readonly playStoreUrl = PLAY_STORE_URL;
  readonly earnWays = EARN_WAYS;

  readonly card = signal<GiftCard | null>(null);
  readonly related = signal<GiftCardSummary[]>([]);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly selectedDenom = signal<GiftCardDenomination | null>(null);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap(params => this.giftCardService.getBySlug(params.get('slug')!)))
      .subscribe({
        next: card => {
          this.card.set(card);
          const amount = giftCardAmount(card);
          this.selectedDenom.set(card.denominations.find(d => d.amount === amount) ?? card.denominations[0] ?? null);
          this.notFound.set(false);
          this.loading.set(false);
          this.applySeo(card);
          this.giftCardService.getRelated(card.relatedSlugs).subscribe(r => this.related.set(r));
        },
        error: () => {
          this.notFound.set(true);
          this.loading.set(false);
        },
      });
  }

  selectDenom(d: GiftCardDenomination): void {
    this.selectedDenom.set(d);
  }

  money(amount: number, currency: string): string {
    return giftCardAmountLabel(amount, currency);
  }

  amount(card: GiftCardSummary): string {
    return giftCardAmountLabel(giftCardAmount(card), card.denominations[0]?.currency ?? 'USD');
  }

  categoryLabel(category: GiftCardCategory): string {
    return coverLabelFor(category);
  }

  seed(id: string): number {
    return seedFromId(id);
  }

  private applySeo(card: GiftCard): void {
    const path = `/gift-cards/${card.slug}`;
    const url = `${SITE_URL}/${this.locale}${path}`;
    this.seo.apply({
      title: card.metaTitle || `${card.title} - Redeem With Points`,
      description: card.metaDescription || card.shortDescription,
      canonicalPath: path,
      image: card.heroImage,
      type: 'product',
      jsonLd: [
        this.seo.productJsonLd({
          name: card.title,
          description: card.metaDescription || card.shortDescription,
          image: card.heroImage,
          url,
          brand: card.brand,
        }),
        this.seo.breadcrumbJsonLd([
          { name: 'Home', url: `${SITE_URL}/${this.locale}` },
          { name: 'Gift Cards', url: `${SITE_URL}/${this.locale}/gift-cards` },
          { name: card.title, url },
        ]),
      ],
    });
  }
}
