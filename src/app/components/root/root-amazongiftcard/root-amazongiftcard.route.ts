import { Routes } from "@angular/router";
import { RootAmazonGiftCardComponent } from "./root-amazongiftcard.component";

export const rootAmazonGiftCardRoutes: Routes = [
  {
    path: '',
    component: RootAmazonGiftCardComponent,
    data: {
      title: 'Earn Amazon Gift Cards with Surveys | Profitpiller',
      description: 'Complete paid surveys on Profitpiller and earn Amazon Gift Cards easily. Redeem your rewards quickly and shop your favorite products hassle-free.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Amazon Gift Cards' }
      ]
    }
  }
];
