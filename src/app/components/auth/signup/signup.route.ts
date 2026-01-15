import { Routes } from "@angular/router";
import { SignUpComponent } from "./signup.component";

export const SignupRoutes: Routes = [
  {
    path: '',
    component: SignUpComponent,
    data: {
      title: 'Create an Account | Profitpiller',
      description:
        'Create a Profitpiller account to access the platform and participate in available research activities.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Create Account' }
      ]
    }
  }
];
