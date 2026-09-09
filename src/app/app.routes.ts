import { Routes } from '@angular/router';
import { authGuard } from './components/auth/auth.guard';
import { langRedirectGuard } from './lang.redirect.guard';

export const routes: Routes = [

  // {
  //   path: '',
  //   pathMatch: 'full',
  //   canActivate: [langRedirectGuard],
  //   children: []
  // },

  // 🌍 LANGUAGE WRAPPER
  {
    path: ':locale',
    canActivate: [langRedirectGuard],
    children: [

      // 🔐 ADMIN
      {
        path: 'admin',
        loadComponent: () => import('./components/admin/admin.component').then(m => m.AdminComponent),
        children: [
          { path: '', redirectTo: 'user-admin-dashboard', pathMatch: 'full' },
          {
            path: 'user-admin-dashboard',
            loadChildren: () =>
              import('./components/admin/dashboard/dashboard.route').then(m => m.AdminDashboardRoutes),
          },
        ],
      },
      // 🔐 AUTH
      {
        path: 'auth',
        loadComponent: () => import('./components/auth/auth.component').then(m => m.AuthComponent),
        children: [
          { path: '', redirectTo: 'login', pathMatch: 'full' },
          { path: 'login', loadChildren: () => import('./components/auth/login/login.route').then(m => m.loginRoutes) },
          { path: 'signup/:id', loadChildren: () => import('./components/auth/signup/signup.route').then(m => m.SignupRoutes) },
          { path: 'verify-link/:idve/:idvp', loadChildren: () => import('./components/auth/verifylink/verifylink.route').then(m => m.verifyLinkRoutes) },
          { path: 'reset-link/:idve/:idvp', loadChildren: () => import('./components/auth/reset-password/reset-password.route').then(m => m.resetPasswordRoutes) },
          { path: 'forgot-password', loadChildren: () => import('./components/auth/forgot-password/forgot-password.route').then(m => m.forgotPasswordRoutes) },
          { path: 'link', loadComponent: () => import('./components/home/offer/offer-popup/offer-link/offer-link.component').then(m => m.OfferLinkComponent) },
          { path: 'callback', loadComponent: () => import('./components/auth/AuthCallbackComponent').then(m => m.AuthCallbackComponent) },
          { path: 'paypalcallback', loadComponent: () => import('./components/auth/AuthCallbackComponent').then(m => m.AuthCallbackComponent) }
        ],
      },

      // 🔐 APP (Protected)
      {
        path: 'app',
        loadComponent: () => import('./components/layout/layout.component').then(m => m.LayoutComponent),
        canActivate: [authGuard],
        children: [
          { path: '', redirectTo: 'earn', pathMatch: 'full' },
          { path: 'instruction', loadChildren: () => import('./components/home/instruction/instruction.route').then(m => m.InstructionRoutes) },
          { path: 'earn', loadChildren: () => import('./components/home/earn/earn.route').then(m => m.EarnRoutes) },
          { path: 'survey', loadChildren: () => import('./components/home/survey/survey.route').then(m => m.SurveyRoutes) },
          { path: 'offers', loadChildren: () => import('./components/home/offer/offer.route').then(m => m.OfferRoutes) },
          { path: 'offerwall', loadChildren: () => import('./components/home/offer-wall/offer-wall.route').then(m => m.OfferWallRoutes) },
          { path: 'cashout', loadChildren: () => import('./components/home/reward/reward.route').then(m => m.RewardRoutes) },
          { path: 'leaderboard', loadChildren: () => import('./components/home/leaderboard/leaderboard.route').then(m => m.LeaderboardRoutes) },
          { path: 'account', loadChildren: () => import('./components/home/profile/profile.route').then(m => m.ProfileRoutes) },
          { path: 'help', loadChildren: () => import('./components/home/help/help.route').then(m => m.HelpRoutes) },
          { path: 'refer', loadChildren: () => import('./components/home/referal/referal.route').then(m => m.ReferalRoutes) },
          { path: 'redeem', loadChildren: () => import('./components/home/redeembonus/redeembonus.route').then(m => m.RedeemBonusRoutes) },
        ],
      },

      // 🌍 PUBLIC (SEO pages)
      {
        path: '',
        loadComponent: () => import('./components/root/root.component').then(m => m.RootComponent),
        children: [
          { path: '', pathMatch: 'full', loadChildren: () => import('./components/root/root-home/root-home.route').then(m => m.rootHomeRoutes) },
          { path: 'aboutus', loadChildren: () => import('./components/root/root-aboutus/root-aboutus.route').then(m => m.rootAboutUsRoutes) },
          { path: 'amazongiftcard', loadChildren: () => import('./components/root/root-amazongiftcard/root-amazongiftcard.route').then(m => m.rootAmazonGiftCardRoutes) },
          { path: 'cashout', loadChildren: () => import('./components/root/root-cash/root-cash.route').then(m => m.rootCashRoutes) },
          { path: 'contactus', loadChildren: () => import('./components/root/root-contactus/root-contactus.route').then(m => m.rootContactUsRoutes) },
          { path: 'do-not-sell', loadChildren: () => import('./components/root/root-donotsellinfo/root-donotsellinfo.route').then(m => m.rootDoNotSellInfoRoutes) },
          { path: 'giftcard', loadChildren: () => import('./components/root/root-giftcard/root-giftcard.route').then(m => m.rootGiftCardRoutes) },
          { path: 'help', loadChildren: () => import('./components/root/root-help/root-help.route').then(m => m.rootHelpRoutes) },
          { path: 'paypal', loadChildren: () => import('./components/root/root-paypal/root-paypal.route').then(m => m.rootPaypalRoutes) },
          { path: 'privacy-policy', loadChildren: () => import('./components/root/root-privacypolicy/root-privacypolicy.route').then(m => m.rootPrivacyPolicyRoutes) },
          { path: 'terms-conditions', loadChildren: () => import('./components/root/root-termcondition/root-termcondition.route').then(m => m.rootTermConditionRoutes) },
          { path: 'visa', loadChildren: () => import('./components/root/root-visa/root-visa.route').then(m => m.rootVisaRoutes) },
          { path: 'cookie-policy', loadChildren: () => import('./components/root/root-cookiepolicy/root-cookiepolicy.route').then(m => m.rootCookiePolicyRoutes) },
          { path: 'redirecttoapk', loadComponent: () => import('./components/root/apk-toggle/apk.redirect').then(m => m.RedirectComponent) },
          { path: 'surveys/:country', loadComponent: () => import('./components/root/seo-landing/seo-landing.component').then(m => m.SeoLandingComponent) },
          { path: 'surveys/:country/:city', loadComponent: () => import('./components/root/seo-landing/seo-landing.component').then(m => m.SeoLandingComponent) },
          { path: 'paid-surveys/:country/:payout', loadComponent: () => import('./components/root/seo-landing/seo-landing.component').then(m => m.SeoLandingComponent) },
          { path: 'earn-money/:country/:segment', loadComponent: () => import('./components/root/seo-landing/seo-landing.component').then(m => m.SeoLandingComponent) },
          { path: 'blog', loadChildren: () => import('./components/blog/blog.route').then(m => m.blogRoutes) },
          { path: 'guides', loadChildren: () => import('./components/blog/guides.route').then(m => m.guidesRoutes) },
          { path: 'gift-cards', loadChildren: () => import('./components/blog/gift-cards/gift-cards.route').then(m => m.giftcardsRoutes) },
        ],
      },

      // 🚫 CLIENT ONLY FLOWS
      {
        path: 'survey',
        loadComponent: () => import('./components/userflow/userflow.component').then(m => m.UserflowComponent),
        children: [
          { path: 'completesurvey', loadChildren: () => import('./components/userflow/complete-survey/complete-survey.route').then(m => m.completeSurveyRoutes) },
          { path: 'getSurveyInventory', loadChildren: () => import('./components/userflow/survey-status/survey-status.route').then(m => m.surveyStatusRoutes) },
          { path: 'takeSurvey', loadChildren: () => import('./components/userflow/take-survey/take-survey.route').then(m => m.takeSurveyRoutes) },
          // { path: 'surveybycampaign', loadChildren: () => import('./components/userflow/take-survey/take-survey.route').then(m => m.takeSurveyRoutes) },
          { path: 'endsurvey', loadChildren: () => import('./components/userflow/end-survey/end-survey.route').then(m => m.endSurveyRoutes) },


          { path: 'welcome', loadComponent: () => import('./components/userflow/survey-programming/welcome/welcome.component').then(m => m.WelcomeComponent) },
          { path: 'eligibility', loadComponent: () => import('./components/userflow/survey-programming/eligibility/eligibility.component').then(m => m.EligibilityComponent) },
          { path: 'questions', loadComponent: () => import('./components/userflow/survey-programming/survey-questions/survey-questions.component').then(m => m.SurveyQuestionsComponent) },
          { path: 'completed', loadComponent: () => import('./components/userflow/survey-programming/completed/completed.component').then(m => m.CompletedComponent) }
        ],
      },

      {
        path: 'offerwall',
        loadComponent: () => import('./components/offerwall/offerwall.component').then(m => m.OfferwallComponent),
        children: [
          { path: '', loadChildren: () => import('./components/offerwall/offerwall-home/offerwall-home.route').then(m => m.offerwallHomeRoutes) },
          { path: 'profile', loadChildren: () => import('./components/offerwall/offerwall-profile/offerwall-profile.route').then(m => m.offerwallProfileRoutes) },
          { path: 'survey', loadChildren: () => import('./components/offerwall/offerwall-survey/offerwall-survey.route').then(m => m.offerwallSurveyRoutes) },
          { path: 'reward', loadChildren: () => import('./components/offerwall/offerwall-reward/offerwall-reward.route').then(m => m.offerwallRewardRoutes) },
        ],
      },

      {
        path: 'surveyresult',
        loadComponent: () => import('./components/userflow/userflow.component').then(m => m.UserflowComponent),
        children: [
          { path: '', loadChildren: () => import('./components/survey-redirects/survey-redirects.route').then(m => m.SurveyRedirectRoutes) }
        ],
      },

      { path: '**', loadComponent: () => import('./components/not-found/not-found.component').then(m => m.NotFoundComponent), data: { statusCode: 404 } }
    ]
  },

  // 🔁 DEFAULT
  // { path: '', redirectTo: 'en', pathMatch: 'full' },

  // 🔁 FALLBACK
  // { path: '**', canActivate: [langRedirectGuard], children: [] }
  { path: '', pathMatch: 'full', redirectTo: 'en-us' },
];