import { Routes } from "@angular/router";
import { ResetPasswordComponent } from "./reset-password.component";

export const resetPasswordRoutes: Routes = [
  {
    path: '',
    component: ResetPasswordComponent,
    data: {
      title: 'Reset Your Password Securely | Profitpiller',
      description: 'Create a new password for your Profitpiller account. Follow the secure reset link to regain access and continue earning through paid surveys.',
      urls: [
        { title: 'Login', url: '/auth/login' },
        { title: 'Reset Password' }
      ]
    }
  }
];
