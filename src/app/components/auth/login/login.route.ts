import { Routes } from "@angular/router";
import { LoginComponent } from "./login.component";

export const loginRoutes: Routes = [
  {
    path: '',
    component: LoginComponent,
    data: {
      title: 'Sign in | Profitpiller',
      description:
        'Sign in to your Profitpiller account to access platform features and manage your account settings.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Sign In' },
      ],
    },
  },
];
