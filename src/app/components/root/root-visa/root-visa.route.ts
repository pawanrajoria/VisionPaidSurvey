import { Routes } from "@angular/router";
import { RootVisaComponent } from "./root-visa.component";

export const rootVisaRoutes: Routes = [
  {
    path: '',
    component: RootVisaComponent,
    data: {
      title: 'Earn Visa Gift Cards from Surveys | Profitpiller',
      description: 'Take surveys on Profitpiller and earn Visa Gift Cards as rewards. Redeem your points for prepaid Visa cards you can use anywhere online or in-store.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Visa Gift Cards' }
      ]
    }
  }
];
