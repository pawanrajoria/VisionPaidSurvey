import { Routes } from "@angular/router";
import { RootVisaComponent } from "./root-visa.component";

export const rootVisaRoutes: Routes = [
  {
    path: '',
    component: RootVisaComponent,
    data: {
      // Neutral, policy-compliant metadata
      title: 'Visa Gift Cards | Profitpiller',
      description: 'Participate in surveys on Profitpiller to earn points that can be redeemed for verified Visa Gift Cards. All redemptions are safe and processed securely.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Visa Gift Cards', url: '/visa-gift-cards' } // internal URL
      ]
    }
  }
];
