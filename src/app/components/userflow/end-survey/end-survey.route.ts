import { Routes } from '@angular/router';
import { EndSurveyComponent } from './end-survey.component';

export const endSurveyRoutes: Routes = [
  {
    path: '',
    component: EndSurveyComponent,
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
