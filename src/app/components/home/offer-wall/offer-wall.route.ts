import { Routes } from "@angular/router";
import { OfferWallComponent } from "./offer-wall.component";

export const OfferWallRoutes: Routes = [
  {
    path: '',
    component: OfferWallComponent,
    data: {
      title: 'Offerwall Tasks – Earn More with Partner Offers | Profitpiller',
      description: 'Boost your earnings with Profitpiller’s Offerwall. Complete partner tasks like app installs, surveys, and sign-ups to earn extra rewards quickly.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Offerwall' }
      ]
    }
  }
];
