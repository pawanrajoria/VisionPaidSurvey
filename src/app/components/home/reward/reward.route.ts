import { Routes } from "@angular/router";
import { RewardComponent } from "./reward.component";

export const RewardRoutes: Routes = [
  {
    path: '',
    component: RewardComponent,
    data: {
      title: 'Cash Out Earnings via PayPal, Gift Cards & More | Profitpiller',
      description: 'Redeem your Profitpiller earnings easily through PayPal, Amazon gift cards, or other popular payout methods. Fast, secure, and reliable cash out options.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Cash Out' }
      ]
    }
  }
];
