import { Routes } from "@angular/router";
import { RewardComponent } from "./reward.component";

export const RewardRoutes: Routes = [
  {
    path: '',
    component: RewardComponent,
    data: {
      title: 'Redeem Rewards | Profitpiller',
      description: 'Redeem your earned points on Profitpiller for verified rewards such as gift cards or other available options. All redemption methods are safe and secure.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Redeem Rewards', url: '/rewards' } // internal URL
      ]
    }
  }
];
