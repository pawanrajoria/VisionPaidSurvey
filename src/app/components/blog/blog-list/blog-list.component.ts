import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap, tap } from 'rxjs';

import { BlogSeoService } from '../seo.service';
import { BlogCategory, BlogPostSummary } from '../blog-post.model';
import { BlogService } from '../blog.service';
import { CoverArtComponent } from '../cover-art/cover-art.component';
import { coverLabelFor } from '../cover-art/cover-art';
import { blogCategoryImage } from '../blog-content.generator';
import { routeLocale, seedFromId } from '../locale';

const CATEGORIES: { value: BlogCategory; label: string; icon: string }[] = [
  { value: 'earn', label: 'Earn', icon: 'payments' },
  { value: 'save', label: 'Save smarter', icon: 'savings' },
  { value: 'rewards', label: 'Rewards & cash-out', icon: 'redeem' },
  { value: 'passive-income', label: 'Side income', icon: 'trending_up' },
  { value: 'gaming', label: 'Games & apps', icon: 'sports_esports' },
  { value: 'guides', label: 'Guides', icon: 'menu_book' },
];

@Component({
  selector: 'pp-blog-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatIconModule, MatPaginatorModule, MatProgressSpinnerModule,
    CoverArtComponent,
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly seo = inject(BlogSeoService);
  private readonly route = inject(ActivatedRoute);

  readonly categories = CATEGORIES;
  readonly locale = routeLocale(this.route);
  /** 'blog' or 'guides' - decides the URL prefix and the hero copy. */
  readonly section: 'blog' | 'guides' = this.route.snapshot.data['section'] === 'guides' ? 'guides' : 'blog';
  private readonly fixedCategory = (this.route.snapshot.data['category'] as BlogCategory | undefined) ?? null;

  readonly posts = signal<BlogPostSummary[]>([]);
  readonly totalItems = signal(0);
  readonly pageSize = signal(24);
  readonly pageIndex = signal(0);
  readonly loading = signal(true);
  readonly activeCategory = signal<BlogCategory | null>(null);
  readonly searchTerm = signal('');

  readonly heading = computed(() => {
    if (this.section === 'guides') return 'Profitpiller Guides';
    const cat = this.categories.find(c => c.value === this.activeCategory());
    return cat ? `${cat.label} articles` : 'The Profitpiller Blog';
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(params => {
          this.activeCategory.set(this.fixedCategory ?? (params.get('category') as BlogCategory) ?? null);
          this.pageIndex.set(0);
          this.searchTerm.set('');
          this.loading.set(true);
        }),
        switchMap(() => this.fetch())
      )
      .subscribe(result => {
        this.posts.set(result.items);
        this.totalItems.set(result.totalItems);
        this.loading.set(false);
        this.applySeo();
      });
  }

  private fetch() {
    return this.blogService.list({
      page: this.pageIndex() + 1,
      pageSize: this.pageSize(),
      category: this.activeCategory() ?? undefined,
    });
  }

  private applySeo(): void {
    const cat = this.activeCategory();
    const isGuides = this.section === 'guides';
    this.seo.apply({
      title: isGuides
        ? 'Profitpiller Guides - Surveys, Offers & Cash-Out Explained'
        : cat ? `${this.heading()} - Profitpiller Blog` : 'Profitpiller Blog - Earning Tips, Surveys & Rewards',
      description: isGuides
        ? 'Step-by-step Profitpiller guides: completing your profile, taking surveys honestly, offer walls, streaks, levels and cashing out from $5 via PayPal, UPI or gift cards.'
        : 'Practical tips for earning on Profitpiller - paid surveys, offers, offer walls, daily streaks, referrals and cash-outs from $5 via PayPal, UPI and gift cards.',
      canonicalPath: this.route.snapshot.url.length
        ? `/${this.section}/${this.route.snapshot.url.map(s => s.path).join('/')}`
        : `/${this.section}`,
      image: blogCategoryImage(cat ?? (isGuides ? 'guides' : 'earn')),
      type: 'website',
    });
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loading.set(true);
    this.fetch().subscribe(result => {
      this.posts.set(result.items);
      this.totalItems.set(result.totalItems);
      this.loading.set(false);
      if (typeof window !== 'undefined') window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
    if (!value.trim()) {
      this.fetch().subscribe(result => {
        this.posts.set(result.items);
        this.totalItems.set(result.totalItems);
      });
      return;
    }
    this.blogService.search(value, this.activeCategory() ?? undefined).subscribe(results => this.posts.set(results));
  }

  postLink(post: BlogPostSummary): string[] {
    return ['/', this.locale, this.section, post.slug];
  }

  categoryLabel(category: string): string {
    return coverLabelFor(category);
  }

  seed(post: BlogPostSummary): number {
    return seedFromId(post.id);
  }

  trackBySlug(_: number, post: BlogPostSummary): string {
    return post.slug;
  }
}
