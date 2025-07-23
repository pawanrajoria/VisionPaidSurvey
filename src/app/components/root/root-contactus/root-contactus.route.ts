import { Routes } from "@angular/router";
import { RootContactUsComponent } from "./root-contactus.component";

export const rootContactUsRoutes: Routes = [
  {
    path: '',
    component: RootContactUsComponent,
    data: {
      title: 'Contact Us | Get in Touch with Profitpiller Support',
      description: 'Reach out to Profitpiller support for any questions, issues, or feedback. Our team is here to help you with surveys, payments, and account management.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Contact Us' }
      ]
    }
  }
];
