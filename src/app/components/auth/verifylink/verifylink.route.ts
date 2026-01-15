import { Routes } from "@angular/router";
import { VerifyLinkComponent } from "./verifylink.component";

export const verifyLinkRoutes: Routes = [
  {
    path: '',
    component: VerifyLinkComponent,
    data: {
      title: 'Email Verification | Profitpiller',
      description:
        'Confirm your email address to complete account setup and enable access to platform features.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Email Verification' }
      ]
    }
  }
];
