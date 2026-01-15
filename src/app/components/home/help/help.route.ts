import { Routes } from "@angular/router";
import { HelpComponent } from "./help.component";

export const HelpRoutes: Routes = [
  {
    path: '',
    component: HelpComponent,
    data: {
      title: 'Help Center – Get Support for Your Account | Profitpiller',
      description: 'Visit the Profitpiller Help Center to find answers to common questions about surveys, points, reward redemption, account access, and other support topics.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Help Center' }
      ]
    }
  }
];
