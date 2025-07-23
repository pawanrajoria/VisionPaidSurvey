import { Routes } from "@angular/router";
import { VerifyLinkComponent } from "./verifylink.component";

export const verifyLinkRoutes: Routes = [
  {
    path: '',
    component: VerifyLinkComponent,
    data: {
      title: 'Verify Your Email to Activate Account | Profitpiller',
      description: 'Confirm your email address to activate your Profitpiller account. This quick verification step helps keep your account secure and ready to earn rewards.',
      urls: [
        { title: 'Login', url: '/auth/login' },
        { title: 'Verify Email' }
      ]
    }
  }
];
