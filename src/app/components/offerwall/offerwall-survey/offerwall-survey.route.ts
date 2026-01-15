import { Routes } from "@angular/router";
import { OfferwallSurveyComponent } from "./offerwall-survey.component";

export const offerwallSurveyRoutes: Routes = [
  {
    path: '',
    component: OfferwallSurveyComponent,
    data: {
      // Neutral, policy-compliant metadata
      title: 'Offerwall Surveys | Profitpiller',
      description: 'Explore surveys available on the Profitpiller Offerwall. Complete tasks to earn points safely through verified partner activities.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Offerwall Surveys', url: '/offerwall-surveys' } // internal URL
      ]
    }
  }
];