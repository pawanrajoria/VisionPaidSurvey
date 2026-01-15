import { Routes } from "@angular/router";
import { RootCookiePolicyComponent } from "./root-cookiepolicy.component";

export const rootCookiePolicyRoutes: Routes = [
  {
    path: '',
    component: RootCookiePolicyComponent,
    data: {
      // Neutral and policy-compliant metadata
      title: 'Cookie Policy | Profitpiller',
      description: 'Read Profitpiller’s Cookie Policy to understand how cookies are used and how your information is collected and protected while using the platform.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Cookie Policy', url: '/cookie-policy' } // internal URL
      ]
    }
  }
];
