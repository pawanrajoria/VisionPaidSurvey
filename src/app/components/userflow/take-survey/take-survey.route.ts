import { Routes } from "@angular/router";
import { TakeSurveyComponent } from "./take-survey.component";

export const takeSurveyRoutes: Routes = [
  {
    path: '',
    component: TakeSurveyComponent,
    data: {
      title: 'Take Survey | Earn Rewards for Your Opinions | Profitpiller',
      description: 'Participate in surveys and get rewarded for sharing your thoughts. Profitpiller offers trusted paid surveys to help you earn real money.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Take Survey' }
      ]
    }
  }
];
