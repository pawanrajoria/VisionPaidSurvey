import { Routes } from "@angular/router";
import { RootPrivacyPolicyComponent } from "./root-privacypolicy.component";

export const rootPrivacyPolicyRoutes: Routes = [
  {
    path: '',
    component: RootPrivacyPolicyComponent,
    data: {
      // Neutral, policy-compliant metadata
      title: 'Privacy Policy | Profitpiller',
      description: 'Read Profitpiller’s Privacy Policy to learn how we collect, use, and protect your personal information while using the platform.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Privacy Policy', url: '/privacy-policy' } // internal URL
      ]
    }
  }
];
