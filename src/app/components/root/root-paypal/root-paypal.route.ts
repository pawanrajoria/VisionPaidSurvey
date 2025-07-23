import { Routes } from "@angular/router";
import { RootPaypalComponent } from "./root-paypal.component";

export const rootPaypalRoutes: Routes = [
  {
    path: '',
    component: RootPaypalComponent,
    data: {
      title: 'Earn PayPal Cash from Paid Surveys | Profitpiller',
      description: 'Complete online surveys and get paid directly to your PayPal account. Join Profitpiller for fast, secure PayPal cash rewards with every survey you complete.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'PayPal Surveys' }
      ]
    }
  }
];
