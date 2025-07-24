import { Routes } from '@angular/router';
import { CompleteSurveyComponent } from './complete-survey.component';

export const completeSurveyRoutes: Routes = [
  {
    path: '',
    component: CompleteSurveyComponent,
    data: {
      title: 'Complete Survey | Profitpiller',
      description: 'Finalizing your survey participation. Redirecting shortly...',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Complete Survey' }
      ]
    }
  }
];
