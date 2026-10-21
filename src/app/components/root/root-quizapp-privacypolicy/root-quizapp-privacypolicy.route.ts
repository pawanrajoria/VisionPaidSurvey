import { Routes } from "@angular/router";
import { RootQuizAppPrivacyPolicyComponent } from "./root-quizapp-privacypolicy";

export const rootQuizAppPrivacyPolicyRoutes: Routes = [
  {
    path: '',
    component: RootQuizAppPrivacyPolicyComponent,
    data: {
      // Neutral, policy-compliant metadata
      title: 'Privacy Policy | ProfitPiller Quiz App',
      description: 'Privacy Policy for the ProfitPiller Quiz app for Android: what the app stores on your device, how Google AdMob ads use data, and your choices.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Quiz App Privacy Policy', url: '/quizapp-privacy_policy' } // internal URL
      ]
    }
  }
];
