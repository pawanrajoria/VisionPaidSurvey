import { Routes } from "@angular/router";
import { RootCashComponent } from "./root-cash.component";

export const rootCashRoutes: Routes = [
  {
    path: '',
    component: RootCashComponent,
    data: {
      title: 'Cash Out Your Earnings Instantly | Profitpiller',
      description: 'Withdraw your Profitpiller earnings instantly with secure payout options like PayPal and direct bank transfers. Fast and reliable cash out anytime.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Cash Out' }
      ]
    }
  }
];
