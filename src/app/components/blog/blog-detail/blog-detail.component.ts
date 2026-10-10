import { SITE_URL } from '../../../site.config';
import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, DOCUMENT } from '@angular/common';
import { RouterLink, ActivatedRoute } from '@angular/router';
import { MatIconModule } from '@angular/material/icon';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { switchMap } from 'rxjs';
import { BlogPost, BlogPostSummary } from '../blog-post.model';
import { BlogService } from '../blog.service';
import { BlogSeoService } from '../seo.service';
import { CoverArtComponent } from '../cover-art/cover-art.component';
import { coverLabelFor } from '../cover-art/cover-art';
import { PLAY_STORE_URL, routeLocale, seedFromId } from '../locale';


@Component({
  selector: 'pp-blog-detail',
  standalone: true,
  imports: [
    CommonModule, RouterLink, MatIconModule, MatExpansionModule, MatProgressSpinnerModule,
    CoverArtComponent,
  ],
  templateUrl: './blog-detail.component.html',
  styleUrl: './blog-detail.component.scss',
})
export class BlogDetailComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly blogService = inject(BlogService);
  private readonly seo = inject(BlogSeoService);
  private readonly doc = inject(DOCUMENT);

  readonly locale = routeLocale(this.route);
  readonly section: 'blog' | 'guides' = this.route.snapshot.data['section'] === 'guides' ? 'guides' : 'blog';
  readonly playStoreUrl = PLAY_STORE_URL;

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
          this.notFound.set(false);
          this.loading.set(false);
          this.buildToc(post);
          this.applySeo(post);
          this.related.set([]);
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
    if (post.content.some(b => b.type === 'faq')) entries.push({ id: 'faq', text: 'FAQ' });
    this.toc.set(entries);
  }

  private slugify(text: string): string {
    return text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }

  private applySeo(post: BlogPost): void {
    const path = `/${this.section}/${post.slug}`;
    const url = `${SITE_URL}/${this.locale}${path}`;
    const sectionName = this.section === 'guides' ? 'Guides' : 'Blog';
    this.seo.apply({
      title: post.metaTitle || post.title,
      description: post.metaDescription || post.excerpt,
      canonicalPath: post.canonicalUrl ?? path,
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
          url,
        }),
        this.seo.breadcrumbJsonLd([
          { name: 'Home', url: `${SITE_URL}/${this.locale}` },
          { name: sectionName, url: `${SITE_URL}/${this.locale}/${this.section}` },
          { name: post.title, url },
        ]),
      ],
    });
  }

  scrollTo(event: Event, id: string): void {
    const el = this.doc.getElementById(id);
    if (!el) return;
    event.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }

  headingId(text: string): string {
    return this.slugify(text);
  }

  categoryLabel(category: string): string {
    return coverLabelFor(category);
  }

  seed(id: string): number {
    return seedFromId(id);
  }
}
