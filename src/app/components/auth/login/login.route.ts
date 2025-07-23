import { Routes } from "@angular/router";
import { LoginComponent } from "./login.component";

export const loginRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'Login to Your Account | Profitpiller',
      description: 'Access your Profitpiller account to continue earning from paid surveys. Secure login for members to view earnings, redeem rewards, and manage profiles.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Login' },
      ],
    },
  },
];
