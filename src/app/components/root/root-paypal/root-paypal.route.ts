import { Routes } from "@angular/router";
import { RootPaypalComponent } from "./root-paypal.component";

export const rootPaypalRoutes: Routes = [
  {
    path: '',
    component: RootPaypalComponent,
    data: {
      // Neutral and policy-compliant metadata
      title: 'PayPal Rewards | Profitpiller',
      description: 'Participate in surveys on Profitpiller to earn points that can be redeemed for verified PayPal rewards safely. All redemptions are processed securely.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'PayPal Rewards', url: '/paypal-rewards' } // internal URL
      ]
    }
  }
];
