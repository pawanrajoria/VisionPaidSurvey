import { Routes } from "@angular/router";
import { RootPrivacyPolicyComponent } from "./root-privacypolicy.component";

export const rootPrivacyPolicyRoutes: Routes = [
  {
    path: '',
    component: RootPrivacyPolicyComponent,
    data: {
      title: 'Privacy Policy | Profitpiller',
      description: 'Read Profitpiller’s Privacy Policy to understand how we collect, use, and protect your personal information when you use our platform.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Privacy Policy' }
      ]
    }
  }
];
