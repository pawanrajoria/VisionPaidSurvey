import { Routes } from "@angular/router";
import { OfferwallIframeHomeComponent } from "./offerwall-iframe-home.component";

export const offerwallIframeHomeRoutes: Routes = [
  {
    path: '',
    component: OfferwallIframeHomeComponent,
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
