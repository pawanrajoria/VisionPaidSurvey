import { Routes } from "@angular/router";
import { OfferwallProfileComponent } from "./offerwall-profile.component";

export const offerwallProfileRoutes: Routes = [
  {
    path: '',
    component: OfferwallProfileComponent,
    data: {
      // Neutral, policy-compliant metadata
      title: 'Offerwall Profile | Profitpiller',
      description: 'View and manage your Offerwall profile on Profitpiller. Track your points, completed tasks, and progress safely.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Offerwall Profile', url: '/offerwall-profile' } // internal URL
      ]
    }
  }
];
