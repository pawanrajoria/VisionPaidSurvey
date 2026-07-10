import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatCardModule } from '@angular/material/card';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap } from 'rxjs';
import { BlogPost, BlogPostSummary } from '../blog-post.model';
import { BlogService } from '../blog.service';
import { BlogSeoService } from '../seo.service';


@Component({
  selector: 'pp-blog-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatIconModule, MatChipsModule, MatCardModule,
    MatExpansionModule, MatButtonModule, MatProgressSpinnerModule,
  ],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly blogService = inject(BlogService);
  private readonly seo = inject(BlogSeoService);

  readonly post = signal<BlogPost | null>(null);
  readonly related = signal<BlogPostSummary[]>([]);
  readonly loading = signal(true);
  readonly notFound = signal(false);

  /** Table of contents, derived from `heading` blocks in the content. */
  readonly toc = signal<{ id: string; text: string }[]>([]);

  ngOnInit(): void {
    this.route.paramMap
      .pipe(switchMap(params => this.blogService.getBySlug(params.get('slug')!)))
      .subscribe({
        next: post => {
          this.post.set(post);
          this.loading.set(false);
          this.buildToc(post);
          this.applySeo(post);
          if (post.relatedSlugs.length) {
            this.blogService.getRelated(post.relatedSlugs).subscribe(r => this.related.set(r));
          }
        },
        error: () => {
          this.notFound.set(true);
          this.loading.set(false);
        },
      });
  }

  private buildToc(post: BlogPost): void {
    const entries = post.content
      .filter(b => b.type === 'heading' && b.heading)
      .map(b => ({ id: this.slugify(b.heading!), text: b.heading! }));
    this.toc.set(entries);
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  private applySeo(post: BlogPost): void {
    const url = `/blog/${post.slug}`;
    this.seo.apply({
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      canonicalPath: post.canonicalUrl ?? url,
      image: post.coverImage,
      type: 'article',
      publishedAt: post.publishedAt,
      updatedAt: post.updatedAt,
      jsonLd: [
        this.seo.articleJsonLd({
          headline: post.title,
          description: post.metaDescription || post.excerpt,
          image: post.coverImage,
          datePublished: post.publishedAt,
          dateModified: post.updatedAt,
          authorName: post.author.name,
          url: `https://profitpiller.com${url}`,
        }),
        this.seo.breadcrumbJsonLd([
          { name: 'Home', url: 'https://profitpiller.com/' },
          { name: 'Blog', url: 'https://profitpiller.com/blog' },
          { name: post.title, url: `https://profitpiller.com${url}` },
        ]),
      ],
    });
  }

  headingId(text: string): string {
    return this.slugify(text);
  }
}
