import { Routes } from "@angular/router";
import { BlogListComponent } from "./blog-list/blog-list.component";
import { BlogDetailComponent } from "./blog-detail/blog-detail.component";

export const guidesRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./blog-list/blog-list.component').then(m => m.BlogListComponent),
    data: { category: 'guides' },
    title: 'Offer Guides | ProfitPiller',
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./blog-detail/blog-detail.component').then(m => m.BlogDetailComponent),
  }
];