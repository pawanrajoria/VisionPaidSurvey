import { Routes } from "@angular/router";
import { OfferComponent } from "./offer.component";

export const OfferRoutes: Routes = [
  {
    path: '',
    component: OfferComponent,
    data: {
      title: 'Complete Offers to Earn Cash & Rewards | Profitpiller',
      description: 'Discover high-paying offers on Profitpiller. Sign up for free trials, apps, and services to earn instant cash or gift card rewards.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Offers' }
      ]
    }
  }
];
