import { Routes } from "@angular/router";
import { OfferWallComponent } from "./offer-wall.component";

export const OfferWallRoutes: Routes = [
  {
    path: '',
    component: OfferWallComponent,
    data: {
      title: 'Offerwall | Profitpiller',
      description: 'Explore tasks and activities available on Profitpiller’s Offerwall. Participate in app installs, surveys, and other partner activities to earn points safely, which can be redeemed for rewards.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Offerwall', url: '/offerwall' } 
      ]
    }
  }
];
