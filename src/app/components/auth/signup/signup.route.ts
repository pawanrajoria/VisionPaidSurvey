import { Routes } from "@angular/router";
import { SignUpComponent } from "./signup.component";

export const SignupRoutes: Routes = [
  {
    path: '',
    component: SignUpComponent,
    data: {
      title: 'Create Your Account & Start Earning | Profitpiller',
      description: 'Sign up with Profitpiller to earn real rewards by completing paid surveys. Join today for free and start redeeming PayPal or gift card payouts instantly.',
      urls: [
        { title: 'Login', url: '/auth/login' },
        { title: 'Sign Up' }
      ]
    }
  }
];
