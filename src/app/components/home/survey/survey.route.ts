import { Routes } from "@angular/router";
import { SurveyComponent } from "./survey.component";

export const SurveyRoutes: Routes = [
  {
    path: '',
    component: SurveyComponent,
    data: {
      title: 'Take Paid Surveys & Earn Instantly | Profitpiller',
      description: 'Join Profitpiller and start taking paid surveys to earn cash and rewards instantly. Participate in surveys that match your profile and get paid quickly.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Surveys' }
      ]
    }
  }
];
