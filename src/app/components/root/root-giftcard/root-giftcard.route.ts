import { Routes } from "@angular/router";
import { RootGiftCardComponent } from "./root-giftcard.component";

export const rootGiftCardComponent: Routes = [
  {
    path: '',
    component: RootGiftCardComponent,
    data: {
      title: 'Get Free Gift Cards for Surveys | Profitpiller',
      description: 'Earn free gift cards by completing paid surveys on Profitpiller. Redeem your rewards quickly and enjoy shopping from top retailers.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Gift Cards' }
      ]
    }
  }
];
