import { Routes } from "@angular/router";
import { RedeemBonusComponent } from "./redeembonus.component";

export const RedeemBonusRoutes: Routes = [
  {
    path: '',
    component: RedeemBonusComponent,
    data: {
      title: 'Redeem Bonus Codes & Promo Rewards | Profitpiller',
      description: 'Enter your Profitpiller bonus code to instantly claim extra rewards, promo points, or special event bonuses. Start boosting your earnings today!',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Redeem Bonus' }
      ]
    }
  }
];
