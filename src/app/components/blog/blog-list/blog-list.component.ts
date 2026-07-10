import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { switchMap, tap } from 'rxjs';

import { BlogSeoService } from '../seo.service';
import { BlogCategory, BlogPostSummary } from '../blog-post.model';
import { BlogService } from '../blog.service';

const CATEGORIES: { value: BlogCategory; label: string; icon: string }[] = [
  { value: 'earn', label: 'Earn', icon: 'payments' },
  { value: 'save', label: 'Save', icon: 'savings' },
  { value: 'rewards', label: 'Rewards', icon: 'redeem' },
  { value: 'passive-income', label: 'Passive Income', icon: 'trending_up' },
  { value: 'gaming', label: 'Gaming', icon: 'sports_esports' },
  { value: 'guides', label: 'Guides', icon: 'menu_book' },
];

@Component({
  selector: 'pp-blog-list',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatCardModule, MatChipsModule, MatIconModule,
    MatButtonModule, MatPaginatorModule, MatProgressSpinnerModule,
    MatFormFieldModule, MatInputModule,
  ],
  templateUrl: './blog-list.component.html',
  styleUrl: './blog-list.component.scss',
})
export class BlogListComponent implements OnInit {
  private readonly blogService = inject(BlogService);
  private readonly seo = inject(BlogSeoService);
  private readonly route = inject(ActivatedRoute);

  readonly categories = CATEGORIES;
  readonly posts = signal<BlogPostSummary[]>([]);
  readonly totalItems = signal(0);
  readonly pageSize = signal(24);
  readonly pageIndex = signal(0);
  readonly loading = signal(true);
  readonly activeCategory = signal<BlogCategory | null>(null);
  readonly searchTerm = signal('');

  readonly heading = computed(() => {
    const cat = this.categories.find(c => c.value === this.activeCategory());
    return cat ? `${cat.label} Articles` : 'Blog';
  });

  ngOnInit(): void {
    this.route.paramMap
      .pipe(
        tap(params => {
          this.activeCategory.set((params.get('category') as BlogCategory) ?? null);
          this.pageIndex.set(0);
        }),
        switchMap(() =>
          this.blogService.list({
            page: this.pageIndex() + 1,
            pageSize: this.pageSize(),
            category: this.activeCategory() ?? undefined,
          })
        )
      )
      .subscribe(result => {
        this.posts.set(result.items);
        this.totalItems.set(result.totalItems);
        this.loading.set(false);
      });

    this.seo.apply({
      title: this.activeCategory() ? `${this.activeCategory()} Articles` : 'Blog — Guides, Tips & Strategies',
      description:
        'Practical guides, tips, and strategies to maximize your online earnings — surveys, offers, games, and rewards explained clearly.',
      canonicalPath: this.route.snapshot.url.length ? `/${this.route.snapshot.url.join('/')}` : '/blog',
      type: 'website',
    });
  }

  onPage(event: PageEvent): void {
    this.pageIndex.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
    this.loading.set(true);
    this.blogService
      .list({ page: event.pageIndex + 1, pageSize: event.pageSize, category: this.activeCategory() ?? undefined })
      .subscribe(result => {
        this.posts.set(result.items);
        this.totalItems.set(result.totalItems);
        this.loading.set(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
  }

  onSearch(value: string): void {
    this.searchTerm.set(value);
    if (!value.trim()) return;
    this.blogService.search(value).subscribe(results => this.posts.set(results));
  }

  trackBySlug(_: number, post: BlogPostSummary): string {
    return post.slug;
  }
}
