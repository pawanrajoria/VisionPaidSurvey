import { Routes } from "@angular/router";
import { RootHomeComponent } from "./root-home.component";

export const rootHomeRoutes: Routes = [
  {
    path: '',
    component: RootHomeComponent,
    data: {
      title: 'Earn Rewards with Paid Surveys | Profitpiller',
      description: 'Join Profitpiller and start earning rewards by completing paid surveys. Sign up for free and get instant access to surveys, offers, and cash-out options.',
      urls: [
        { title: 'Home' }
      ]
    }
  }
];
