import { Routes } from "@angular/router";

export const blogRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blog-list/blog-list.component').then(m => m.BlogListComponent),
    title: 'Blog - Guides, Tips & Strategies | ProfitPiller',
  },
  {
    path: 'category/:category',
    loadComponent: () =>
      import('./blog-list/blog-list.component').then(m => m.BlogListComponent),
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./blog-detail/blog-detail.component').then(m => m.BlogDetailComponent),
  }
];