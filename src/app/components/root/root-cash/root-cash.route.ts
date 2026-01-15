import { Routes } from "@angular/router";
import { RootCashComponent } from "./root-cash.component";

export const rootCashRoutes: Routes = [
  {
    path: '',
    component: RootCashComponent,
    data: {
      title: 'Redeem Points | Profitpiller',
      description: 'Redeem your earned points on Profitpiller for verified rewards. All redemptions are secure and processed safely through approved methods.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Redeem Points', url: '/redeem-points' } // internal URL
      ]
    }
  }
];
