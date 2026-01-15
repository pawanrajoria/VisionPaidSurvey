import { Routes } from "@angular/router";
import { ReferalComponent } from "./referal.component";

export const ReferalRoutes: Routes = [
  {
    path: '',
    component: ReferalComponent,
    data: {
      title: 'Referral Program | Profitpiller',
      description: 'Share Profitpiller with friends using your unique link. Earn points when friends participate in surveys and activities safely through your referral link.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Referral Program', url: '/referral' } // internal URL
      ]
    }
  }
];
