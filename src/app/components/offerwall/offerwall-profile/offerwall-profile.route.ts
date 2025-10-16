import { Routes } from "@angular/router";
import { OfferwallProfileComponent } from "./offerwall-profile.component";

export const offerwallProfileRoutes: Routes = [
  {
    path: '',
    component: OfferwallProfileComponent,
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
