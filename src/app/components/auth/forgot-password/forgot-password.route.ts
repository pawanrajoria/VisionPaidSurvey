import { Routes } from "@angular/router";
import { ForgotPasswordComponent } from "./forgot-password.component";

export const forgotPasswordRoutes: Routes = [
  {
    path: '',
    component: ForgotPasswordComponent,
    data: {
      title: 'Forgot Password? Recover Access | Profitpiller',
      description: 'Reset your Profitpiller account password easily. Enter your email to receive recovery instructions and regain access to your surveys and rewards.',
      urls: [
        { title: 'Login', url: '/auth/login' },
        { title: 'Forgot Password' }
      ]
    }
  }
];
