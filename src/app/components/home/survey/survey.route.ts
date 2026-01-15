import { Routes } from "@angular/router";
import { SurveyComponent } from "./survey.component";

export const SurveyRoutes: Routes = [
  {
    path: '',
    component: SurveyComponent,
    data: {
      title: 'Surveys | Profitpiller',
      description: 'Participate in surveys on Profitpiller to share your opinions and earn points safely. Redeem your points for rewards through verified channels.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Surveys', url: '/surveys' } 
      ]
    }
  }
];
