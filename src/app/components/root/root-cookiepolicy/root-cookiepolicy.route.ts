import { Routes } from "@angular/router";
import { RootCookiePolicyComponent } from "./root-cookiepolicy.component";

export const rootCookiePolicyRoutes: Routes = [
  {
    path: '',
    component: RootCookiePolicyComponent,
    data: {
      title: 'Cookie Policy | Profitpiller',
      description: "Read Profitpiller’s Cookie Policy to understand how we collect, use, and protect your personal information when you use our platform.",
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Privacy Policy' }
      ]
    }
  }
];
