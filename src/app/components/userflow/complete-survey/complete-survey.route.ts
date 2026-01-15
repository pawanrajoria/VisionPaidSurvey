import { Routes } from '@angular/router';
import { CompleteSurveyComponent } from './complete-survey.component';

export const completeSurveyRoutes: Routes = [
  {
    path: '',
    component: CompleteSurveyComponent,
    data: {
      // Neutral, policy-compliant metadata
      title: 'Complete Survey | Profitpiller',
      description: 'You have completed your survey participation. You may proceed to redeem points or explore other activities on the platform.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Complete Survey', url: '/complete-survey' } // internal URL
      ]
    }
  }
];
