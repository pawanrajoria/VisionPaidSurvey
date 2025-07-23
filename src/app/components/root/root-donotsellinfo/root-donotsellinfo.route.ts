import { Routes } from "@angular/router";
import { RootDoNotSellInfoComponent } from "./root-donotsellinfo.component";

export const rootDoNotSellInfoRoutes: Routes = [
  {
    path: '',
    component: RootDoNotSellInfoComponent,
    data: {
      title: 'Do Not Sell My Personal Information | Profitpiller',
      description: 'Learn how to exercise your California Consumer Privacy Act (CCPA) rights with Profitpiller. Request us to not sell your personal information to third parties.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Do Not Sell Info' }
      ]
    }
  }
];
