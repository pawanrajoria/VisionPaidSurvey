import { Routes } from "@angular/router";
import { ReferalComponent } from "./referal.component";

export const ReferalRoutes: Routes = [
  {
    path: '',
    component: ReferalComponent,
    data: {
      title: 'Refer Friends & Earn Bonus Rewards | Profitpiller',
      description: 'Invite friends to join Profitpiller and earn bonus rewards for every successful referral. Share your unique link and start earning today!',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Refer & Earn' }
      ]
    }
  }
];
