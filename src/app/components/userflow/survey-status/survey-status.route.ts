import { Routes } from '@angular/router';
import { SurveyStatusComponent } from './survey-status.component';

export const surveyStatusRoutes: Routes = [
  {
    path: '',
    component: SurveyStatusComponent,
    data: {
      // Neutral, policy-compliant metadata
      title: 'Survey Status | Profitpiller',
      description: 'View the status of your survey participation and any points earned on Profitpiller.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Survey Status', url: '/survey-status' } // internal URL
      ]
    }
  }
];
