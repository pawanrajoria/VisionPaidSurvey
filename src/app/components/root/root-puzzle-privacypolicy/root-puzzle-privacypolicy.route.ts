import { Routes } from "@angular/router";
import { RootPuzzlePrivacyPolicyComponent } from "./root-puzzle-privacypolicy";

export const rootPuzzlePrivacyPolicyRoutes: Routes = [
  {
    path: '',
    component: RootPuzzlePrivacyPolicyComponent,
    data: {
      title: 'Privacy Policy | ProfitPiller Puzzle',
      description: 'Privacy Policy for the ProfitPiller Puzzle app for Android: what the app stores on your phone, Google AdMob ads, the optional surveys and the leaderboard.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Puzzle Privacy Policy', url: '/puzzle-privacy-policy' }
      ]
    }
  }
];
