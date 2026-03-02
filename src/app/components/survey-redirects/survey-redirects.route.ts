import { Routes } from "@angular/router";
import { SurveyRedirectsComponent } from "./survey-redirects.component";

export const SurveyRedirectRoutes: Routes = [
  {
    path: '',
    component: SurveyRedirectsComponent,
    data: {
      title: 'Survey Status | ProfitPiller',
      description: 'Survey status update for your recent participation. This page displays completion or termination information.',
      urls: [
        { title: 'Dashboard', url: '/' },
        { title: 'Survey Status' }
      ]
    }
  }
];
