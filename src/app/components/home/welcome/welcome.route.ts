import { Routes } from "@angular/router";
import { WelcomeComponent } from "./welcome.component";

export const WelcomeRoutes: Routes = [
  {
    path: '',
    component: WelcomeComponent,
    data: {
      title: 'Welcome | Set up your profile',
      description: 'Answer a few quick profile questions to unlock better-matched surveys and a welcome bonus.',
      urls: [
        { title: 'Dashboard', url: '/' },
        { title: 'Welcome' }
      ]
    }
  }
];
