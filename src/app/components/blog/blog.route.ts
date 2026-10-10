import { Routes } from "@angular/router";

export const blogRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blog-list/blog-list.component').then(m => m.BlogListComponent),
    data: { section: 'blog' },
    title: 'Blog - Earning Tips for Profitpiller | Profitpiller',
  },
  {
    path: 'category/:category',
    loadComponent: () =>
      import('./blog-list/blog-list.component').then(m => m.BlogListComponent),
    data: { section: 'blog' },
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./blog-detail/blog-detail.component').then(m => m.BlogDetailComponent),
    data: { section: 'blog' },
  }
];