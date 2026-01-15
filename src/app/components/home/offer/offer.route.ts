import { Routes } from "@angular/router";
import { OfferComponent } from "./offer.component";

export const OfferRoutes: Routes = [
  {
    path: '',
    component: OfferComponent,
    data: {
      title: 'Offers | Profitpiller',
      description: 'Explore available offers on Profitpiller. Participate in surveys, trials, and other activities to earn points that can be redeemed for rewards safely.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Offers', url: '/offers' } 
      ]
    }
  }
];
