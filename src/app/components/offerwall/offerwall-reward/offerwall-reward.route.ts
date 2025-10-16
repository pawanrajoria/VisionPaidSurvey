import { Routes } from "@angular/router";
import { OfferwallRewardComponent } from "./offerwall-reward.component";

export const offerwallRewardRoutes: Routes = [
  {
    path: '',
    component: OfferwallRewardComponent,
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
