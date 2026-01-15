import { Routes } from "@angular/router";
import { ResetPasswordComponent } from "./reset-password.component";

export const resetPasswordRoutes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent,
    data: {
      title: 'Reset Password | Profitpiller',
      description:
        'Create a new password to regain access to your Profitpiller account securely.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Reset Password' }
      ]
    }
  }
];
