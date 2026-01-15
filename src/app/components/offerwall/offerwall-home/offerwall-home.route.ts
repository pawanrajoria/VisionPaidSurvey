import { Routes } from "@angular/router";
import { OfferwallHomeComponent } from "./offerwall-home.component";

export const offerwallHomeRoutes: Routes = [
  {
    path: '',
    component: OfferwallHomeComponent,
    data: {
      // Neutral, policy-compliant metadata
      title: 'Offerwall | Profitpiller',
      description: 'Explore available tasks and activities on the Profitpiller Offerwall. Earn points safely through verified partner tasks and surveys.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Offerwall', url: '/offerwall' } // internal URL
      ]
    }
  }
];
