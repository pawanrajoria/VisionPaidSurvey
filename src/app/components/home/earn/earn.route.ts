import { Routes } from "@angular/router";
import { EarnComponent } from "./earn.component";

export const EarnRoutes: Routes = [
  {
    path: '',
    component: EarnComponent,
    data: {
      title: 'Play Games to Earn Cash & Rewards | Profitpiller',
      description: 'Discover fun and exciting games on Profitpiller. Play to earn points, which you can redeem for cash or gift cards.',
      urls: [
        { title: 'Dashboard', url: '/' },
        { title: 'Earn' }
      ]
    }
  }
];
