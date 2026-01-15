import { Routes } from "@angular/router";
import { TakeSurveyComponent } from "./take-survey.component";

export const takeSurveyRoutes: Routes = [
  {
    path: '',
    component: TakeSurveyComponent,
    data: {
      // Neutral, policy-compliant metadata
      title: 'Take Survey | Profitpiller',
      description: 'Participate in surveys on Profitpiller and earn points that can be redeemed for verified rewards. All activities are safe and secure.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Take Survey', url: '/take-survey' } // internal URL
      ]
    }
  }
];
