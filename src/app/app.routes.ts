import { Routes } from '@angular/router';
import { LayoutComponent } from './components/layout/layout.component';
import { LoginComponent } from './components/auth/login/login.component';
import { authGuard } from './components/auth/auth.guard';
import { AuthComponent } from './components/auth/auth.component';
import { RootComponent } from './components/root/root.component';
import { OfferLinkComponent } from './components/home/offer/offer-popup/offer-link/offer-link.component';
import { AdminComponent } from './components/admin/admin.component';
import { CompleteSurveyComponent } from './components/userflow/complete-survey/complete-survey.component';
import { SurveyStatusComponent } from './components/userflow/survey-status/survey-status.component';
import { TakeSurveyComponent } from './components/userflow/take-survey/take-survey.component';
import { UserflowComponent } from './components/userflow/userflow.component';
import { OfferwallComponent } from './components/offerwall/offerwall.component';
import { AuthCallbackComponent } from './components/auth/AuthCallbackComponent';

export const routes: Routes = [
  {
    path: 'admin',
    component: AdminComponent,
    children: [
      { path: '', redirectTo: 'user-admin-dashboard', pathMatch: 'full' },
      {
        path: 'user-admin-dashboard',
        loadChildren: () =>
          import('./components/admin/dashboard/dashboard.route').then((m) => m.AdminDashboardRoutes),
      },
    ],
  },
  {
    path: 'auth',
    component: AuthComponent,
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      {
        path: 'login',
        loadChildren: () =>
          import('./components/auth/login/login.route').then((m) => m.loginRoutes),
      },
      {
        path: 'signup/:id',
        loadChildren: () =>
          import('./components/auth/signup/signup.route').then((m) => m.SignupRoutes),
      },
      {
        path: 'verify-link/:idve/:idvp',
        loadChildren: () =>
          import('./components/auth/verifylink/verifylink.route').then((m) => m.verifyLinkRoutes),
      },
      {
        path: 'reset-link/:idve/:idvp',
        loadChildren: () =>
          import('./components/auth/reset-password/reset-password.route').then((m) => m.resetPasswordRoutes),
      },
      {
        path: 'forgot-password',
        loadChildren: () =>
          import('./components/auth/forgot-password/forgot-password.route').then((m) => m.forgotPasswordRoutes),
      },
      {
        path: 'link',
        component: OfferLinkComponent,
        data: { title: 'Redirecting to Offer Link | Profitpiller' },
      },
      { path: 'callback', component: AuthCallbackComponent }
    ],
  },
  {
    path: 'app',
    component: LayoutComponent,
    canActivate: [authGuard],
    canLoad: [authGuard],
    children: [
      { path: '', redirectTo: 'earn', pathMatch: 'full' },
      {
        path: 'earn',
        loadChildren: () =>
          import('./components/home/earn/earn.route').then((m) => m.EarnRoutes),
      },
      {
        path: 'survey',
        loadChildren: () =>
          import('./components/home/survey/survey.route').then((m) => m.SurveyRoutes),
      },
      {
        path: 'offers',
        loadChildren: () =>
          import('./components/home/offer/offer.route').then((m) => m.OfferRoutes),
      },
      {
        path: 'offerwall',
        loadChildren: () =>
          import('./components/home/offer-wall/offer-wall.route').then((m) => m.OfferWallRoutes),
      },
      {
        path: 'cashout',
        loadChildren: () =>
          import('./components/home/reward/reward.route').then((m) => m.RewardRoutes),
      },
      {
        path: 'leaderboard',
        loadChildren: () =>
          import('./components/home/leaderboard/leaderboard.route').then((m) => m.LeaderboardRoutes),
      },
      {
        path: 'account',
        loadChildren: () =>
          import('./components/home/profile/profile.route').then((m) => m.ProfileRoutes),
      },
      {
        path: 'help',
        loadChildren: () =>
          import('./components/home/help/help.route').then((m) => m.HelpRoutes),
      },
      {
        path: 'refer',
        loadChildren: () =>
          import('./components/home/referal/referal.route').then((m) => m.ReferalRoutes),
      },
      {
        path: 'redeem',
        loadChildren: () =>
          import('./components/home/redeembonus/redeembonus.route').then((m) => m.RedeemBonusRoutes),
      },
    ],
  },
  {
    path: '',
    component: RootComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/root/root-home/root-home.route').then((m) => m.rootHomeRoutes),
      },
      {
        path: 'aboutus',
        loadChildren: () =>
          import('./components/root/root-aboutus/root-aboutus.route').then((m) => m.rootAboutUsRoutes),
      },
      {
        path: 'amazongiftcard',
        loadChildren: () =>
          import('./components/root/root-amazongiftcard/root-amazongiftcard.route').then((m) => m.rootAmazonGiftCardRoutes),
      },
      {
        path: 'cashout',
        loadChildren: () =>
          import('./components/root/root-cash/root-cash.route').then((m) => m.rootCashRoutes),
      },
      {
        path: 'contactus',
        loadChildren: () =>
          import('./components/root/root-contactus/root-contactus.route').then((m) => m.rootContactUsRoutes),
      },
      {
        path: 'do-not-sell',
        loadChildren: () =>
          import('./components/root/root-donotsellinfo/root-donotsellinfo.route').then((m) => m.rootDoNotSellInfoRoutes),
      },
      {
        path: 'giftcard',
        loadChildren: () =>
          import('./components/root/root-giftcard/root-giftcard.route').then((m) => m.rootGiftCardComponent),
      },
      {
        path: 'help',
        loadChildren: () =>
          import('./components/root/root-help/root-help.route').then((m) => m.rootHelpRoutes),
      },
      {
        path: 'paypal',
        loadChildren: () =>
          import('./components/root/root-paypal/root-paypal.route').then((m) => m.rootPaypalRoutes),
      },
      {
        path: 'privacy-policy',
        loadChildren: () =>
          import('./components/root/root-privacypolicy/root-privacypolicy.route').then((m) => m.rootPrivacyPolicyRoutes),
      },
      {
        path: 'terms-conditions',
        loadChildren: () =>
          import('./components/root/root-termcondition/root-termcondition.route').then((m) => m.rootTermConditionRoutes),
      },
      {
        path: 'visa',
        loadChildren: () =>
          import('./components/root/root-visa/root-visa.route').then((m) => m.rootVisaRoutes),
      },
      {
        path: 'cookie-policy',
        loadChildren: () =>
          import('./components/root/root-cookiepolicy/root-cookiepolicy.route').then((m) => m.rootCookiePolicyRoutes),
      },


    ],
  },
  {
    path: 'survey',
    component: UserflowComponent,
    children: [
      {
        path: 'completesurvey',
        loadChildren: () =>
          import('./components/userflow/complete-survey/complete-survey.route').then((m) => m.completeSurveyRoutes)
      },
      {
        path: 'getSurveyInventory',
        loadChildren: () =>
          import('./components/userflow/survey-status/survey-status.route').then((m) => m.surveyStatusRoutes)
      },
      {
        path: 'takeSurvey',
        loadChildren: () =>
          import('./components/userflow/take-survey/take-survey.route').then((m) => m.takeSurveyRoutes)
      },
      {
        path: 'endsurvey',
        loadChildren: () =>
          import('./components/userflow/end-survey/end-survey.route').then((m) => m.endSurveyRoutes)
      },
    ],
  },
  {
    path: 'offerwall',
    component: OfferwallComponent,
    children: [
      {
        path: '',
        loadChildren: () =>
          import('./components/offerwall/offerwall-home/offerwall-home.route').then((m) => m.offerwallHomeRoutes),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./components/offerwall/offerwall-profile/offerwall-profile.route').then((m) => m.offerwallProfileRoutes),
      },
      {
        path: 'survey',
        loadChildren: () =>
          import('./components/offerwall/offerwall-survey/offerwall-survey.route').then((m) => m.offerwallSurveyRoutes),
      },
      {
        path: 'reward',
        loadChildren: () =>
          import('./components/offerwall/offerwall-reward/offerwall-reward.route').then((m) => m.offerwallRewardRoutes),
      }
    ],
  },
  // {
  //   path: '**',
  //   redirectTo: '/auth/login',
  //   pathMatch: 'full',
  // },
];





// // src/app/app.routes.ts

// import { inject } from '@angular/core';
// import { Auth, user } from '@angular/fire/auth';
// import { map } from 'rxjs/operators';
// import { Router, type Routes } from '@angular/router';

// // The AuthGuard function
// const isAuthenticatedGuard = () => {
//   const auth = inject(Auth); // **The injector needs the provider from app.config.ts**
//   const router = inject(Router);

//   return user(auth).pipe(
//     map(firebaseUser => {
//       // Check if the user object exists
//       if (firebaseUser) {
//         return true;
//       }
//       // Redirect to login if not authenticated
//       return router.createUrlTree(['/login']);
//     })
//   );
// };

// export const routes: Routes = [
//   // ... other routes
//   {
//     path: 'dashboard',
//     canActivate: [isAuthenticatedGuard], // Guard uses the Auth service
//     loadComponent: () => import('./dashboard/dashboard.component')
//   }
// ];