import { Routes } from "@angular/router";
import { OfferwallHomeComponent } from "./offerwall-home.component";

export const offerwallHomeRoutes: Routes = [
  {
    path: '',
    component: OfferwallHomeComponent,
    data: {
      title: 'Help Center – Get Support for Your Account | Profitpiller',
      description: 'Need assistance? Visit the Profitpiller Help Center to find answers to common questions about surveys, payments, account access, and more.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Help Center' }
      ]
    }
  }
];
