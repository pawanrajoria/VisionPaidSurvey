import { Routes } from "@angular/router";
import { RootGiftCardComponent } from "./root-giftcard.component";

export const rootGiftCardRoutes: Routes = [
  {
    path: '',
    component: RootGiftCardComponent,
    data: {
      title: 'Gift Cards | Profitpiller',
      description: 'Participate in surveys on Profitpiller to earn points that can be redeemed for gift cards from verified retailers. All redemptions are safe and secure.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Gift Cards', url: '/gift-cards' } // internal URL
      ]
    }
  }
];
