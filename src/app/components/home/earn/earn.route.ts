import { Routes } from "@angular/router";
import { EarnComponent } from "./earn.component";

export const EarnRoutes: Routes = [
  {
    path: '',
    component: EarnComponent,
    data: {
      title: 'Play Games & Discover Rewards | Profitpiller',
      description: 'Explore interactive games and activities on Profitpiller. Collect points through participation and unlock available reward options.',
      urls: [
        { title: 'Dashboard', url: '/' },
        { title: 'Rewards' }
      ]
    }
  }
];
