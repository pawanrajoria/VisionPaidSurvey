import { Routes } from "@angular/router";
import { RootAmazonGiftCardComponent } from "./root-amazongiftcard.component";

export const rootAmazonGiftCardRoutes: Routes = [
  {
    path: '',
    component: RootAmazonGiftCardComponent,
    data: {
      title: 'Amazon Gift Cards | Profitpiller',
      description: 'Participate in surveys on Profitpiller to earn points that can be redeemed for Amazon Gift Cards. All redemptions are safe and verified.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Amazon Gift Cards', url: '/amazon-gift-cards' } // internal URL
      ]
    }
  }
];
