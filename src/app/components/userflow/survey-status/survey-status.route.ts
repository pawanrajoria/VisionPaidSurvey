import { Routes } from '@angular/router';
import { SurveyStatusComponent } from './survey-status.component';

export const surveyStatusRoutes: Routes = [
  {
    path: '',
    component: SurveyStatusComponent,
    data: {
      title: 'Survey Status | Profitpiller',
      description: 'Check the status of your survey participation on Profitpiller.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Survey Status' }
      ]
    }
  }
];
