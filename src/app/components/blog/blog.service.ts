import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { BlogCategory, BlogPost, BlogPostSummary } from './blog-post.model';
import {
  listBlogSummaries, getBlogPostBySlug, generateBlogSummary,
  searchBlogSummaries, parseIndexFromSlug,
} from './blog-content.generator';

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  totalItems: number;
  totalPages: number;
}

/**
 * Data access for blog/guide content.
 *
 * Zero-storage: every post is computed on the fly from its numeric
 * position by blog-content.generator.ts (deterministic modular
 * arithmetic over fixed word banks) - no JSON files, no API, no
 * database. The same slug always regenerates the exact same content,
 * so this scales to 100k+ addressable pages with nothing to store,
 * host, or keep in sync.
 *
 * The Observable-returning shape is kept so the components (which
 * already expect an async data source) don't need to change - `of()`
 * just wraps the synchronously-computed result.
 */
@Injectable({ providedIn: 'root' })
export class BlogService {
  list(opts: { page?: number; pageSize?: number; category?: BlogCategory; tag?: string } = {}):
    Observable<Paginated<BlogPostSummary>> {
    const page = opts.page ?? 1;
    const pageSize = opts.pageSize ?? 24;
    const { items, totalItems, totalPages } = listBlogSummaries({ page, pageSize, category: opts.category });
    return of({ items, page, pageSize, totalItems, totalPages });
  }

  getBySlug(slug: string): Observable<BlogPost> {
    const post = getBlogPostBySlug(slug);
    if (!post) {
      return new Observable<BlogPost>(sub => sub.error(new Error(`No post for slug "${slug}"`)));
    }
    return of(post);
  }

  getRelated(slugs: string[]): Observable<BlogPostSummary[]> {
    const items = slugs
      .map(parseIndexFromSlug)
      .filter((i): i is number => i !== null)
      .map(generateBlogSummary);
    return of(items);
  }

  search(query: string): Observable<BlogPostSummary[]> {
    return of(searchBlogSummaries(query));
  }
}
