import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatChipsModule } from '@angular/material/chips';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap } from 'rxjs';
import { BlogGiftCardService } from '../gift-card.service';
import { BlogSeoService } from '../../seo.service';
import { GiftCard, GiftCardDenomination } from '../gift-card.model';


@Component({
  selector: 'pp-gift-card-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatIconModule, MatButtonModule, MatChipsModule,
    MatExpansionModule, MatProgressSpinnerModule,
  ],
  templateUrl: './gift-card-detail.component.html',
  styleUrl: './gift-card-detail.component.scss',
})
export class GiftCardDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly giftCardService = inject(BlogGiftCardService);
  private readonly seo = inject(BlogSeoService);

  readonly card = signal<GiftCard | null>(null);
  readonly loading = signal(true);
  readonly notFound = signal(false);
  readonly selectedDenom = signal<GiftCardDenomination | null>(null);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap(params => this.giftCardService.getBySlug(params.get('slug')!)))
      .subscribe({
        next: card => {
          this.card.set(card);
          this.selectedDenom.set(card.denominations.find(d => d.inStock) ?? card.denominations[0] ?? null);
          this.loading.set(false);
          this.applySeo(card);
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

  private applySeo(card: GiftCard): void {
    const url = `/gift-cards/${card.slug}`;
    const amounts = card.denominations.map(d => d.amount);
    this.seo.apply({
      title: card.metaTitle || `${card.title} — Redeem With Points`,
      description: card.metaDescription || card.shortDescription,
      canonicalPath: url,
      image: card.heroImage,
      type: 'product',
      jsonLd: [
        this.seo.productJsonLd({
          name: card.title,
          description: card.metaDescription || card.shortDescription,
          image: card.heroImage,
          url: `https://profitpiller.com${url}`,
          lowPrice: Math.min(...amounts),
          highPrice: Math.max(...amounts),
          currency: card.denominations[0]?.currency ?? 'USD',
          ratingValue: card.rating,
          reviewCount: card.reviewCount,
        }),
        this.seo.breadcrumbJsonLd([
          { name: 'Home', url: 'https://profitpiller.com/' },
          { name: 'Gift Cards', url: 'https://profitpiller.com/gift-cards' },
          { name: card.title, url: `https://profitpiller.com${url}` },
        ]),
      ],
    });
  }
}
