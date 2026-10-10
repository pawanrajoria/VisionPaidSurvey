import { Routes } from "@angular/router";

export const guidesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blog-list/blog-list.component').then(m => m.BlogListComponent),
    data: { category: 'guides', section: 'guides' },
    title: 'Profitpiller Guides | Profitpiller',
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./blog-detail/blog-detail.component').then(m => m.BlogDetailComponent),
    data: { section: 'guides' },
  }
];