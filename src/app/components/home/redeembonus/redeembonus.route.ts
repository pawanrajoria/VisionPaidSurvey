import { Routes } from "@angular/router";
import { RedeemBonusComponent } from "./redeembonus.component";

export const RedeemBonusRoutes: Routes = [
  {
    path: '',
    component: RedeemBonusComponent,
    data: {
      title: 'Redeem Codes | Profitpiller',
      description: 'Enter your Profitpiller code to claim points or participate in promotional activities. All redemptions are safe and verified.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Redeem Codes', url: '/redeem-bonus' } // internal URL
      ]
    }
  }
];
