import { Routes } from "@angular/router";
import { RootAboutUsComponent } from "./root-aboutus.component";

export const rootAboutUsRoutes: Routes = [
  {
    path: '',
    component: RootAboutUsComponent,
    data: {
      title: 'About Us | Trusted Paid Survey Platform | Profitpiller',
      description: 'Learn about Profitpiller, a trusted platform for paid surveys that helps users earn real rewards. Discover our mission, values, and commitment to transparency.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'About Us' }
      ]
    }
  }
];
