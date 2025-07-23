import { Routes } from "@angular/router";
import { LandingPageComponent } from "./landing-page.component";

export const landingPageRoutes: Routes = [
  {
    path: '',
    component: LandingPageComponent,
    data: {
      title: 'Start Earning with Paid Surveys | Profitpiller',
      description: 'Join Profitpiller to take paid surveys, earn real rewards, and redeem gift cards or cash. Quick signup and instant access to top-paying surveys.',
      urls: [
        { title: 'Landing', url: '/' },
        { title: 'Landing Page' },
      ],
    },
  },
];
