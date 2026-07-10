import { Routes } from "@angular/router";

export const giftcardsRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./gift-card-list/gift-card-list.component').then(
        m => m.GiftCardListComponent
      ),
    title: 'Gift Cards - Redeem Your Points | ProfitPiller',
  },
  {
    path: 'category/:category',
    loadComponent: () =>
      import('./gift-card-list/gift-card-list.component').then(
        m => m.GiftCardListComponent
      ),
  },
  {
    path: ':slug',
    loadComponent: () =>
      import('./gift-card-detail/gift-card-detail.component').then(
        m => m.GiftCardDetailComponent
      ),
  }
];