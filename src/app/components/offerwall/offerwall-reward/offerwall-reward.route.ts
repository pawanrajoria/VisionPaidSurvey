import { Routes } from "@angular/router";
import { OfferwallRewardComponent } from "./offerwall-reward.component";

export const offerwallRewardRoutes: Routes = [
  {
    path: '',
    component: OfferwallRewardComponent,
    data: {
      // Neutral, policy-compliant metadata
      title: 'Offerwall Rewards | Profitpiller',
      description: 'View your points and rewards earned from Offerwall tasks on Profitpiller. All points and redemptions are tracked safely and securely.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Offerwall Rewards', url: '/offerwall-rewards' } // internal URL
      ]
    }
  }
];
