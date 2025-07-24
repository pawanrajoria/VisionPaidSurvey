import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // Public root pages
  { path: '', renderMode: RenderMode.Server },
  { path: 'aboutus', renderMode: RenderMode.Server },
  { path: 'amazongiftcard', renderMode: RenderMode.Server },
  { path: 'cashout', renderMode: RenderMode.Server },
  { path: 'contactus', renderMode: RenderMode.Server },
  { path: 'do-not-sell', renderMode: RenderMode.Server },
  { path: 'giftcard', renderMode: RenderMode.Server },
  { path: 'help', renderMode: RenderMode.Server },
  { path: 'paypal', renderMode: RenderMode.Server },
  { path: 'privacy-policy', renderMode: RenderMode.Server },
  { path: 'terms-conditions', renderMode: RenderMode.Server },
  { path: 'visa', renderMode: RenderMode.Server },
  { path: 'survey/completesurvey', renderMode: RenderMode.Server },
  { path: 'survey/getSurveyInventory', renderMode: RenderMode.Server },

  // Auth routes
  { path: 'auth/login', renderMode: RenderMode.Server },
  { path: 'auth/signup/:id', renderMode: RenderMode.Server },
  { path: 'auth/verify-link/:idve/:idvp', renderMode: RenderMode.Server },
  { path: 'auth/reset-link/:idve/:idvp', renderMode: RenderMode.Server },
  { path: 'auth/forgot-password', renderMode: RenderMode.Server },
  { path: 'auth/link', renderMode: RenderMode.Server },

  // Protected (post-login) app routes
  { path: 'app', renderMode: RenderMode.Server },
  { path: 'app/survey', renderMode: RenderMode.Server },
  { path: 'app/offers', renderMode: RenderMode.Server },
  { path: 'app/offerwall', renderMode: RenderMode.Server },
  { path: 'app/cashout', renderMode: RenderMode.Server },
  { path: 'app/leaderboard', renderMode: RenderMode.Server },
  { path: 'app/account', renderMode: RenderMode.Server },
  { path: 'app/help', renderMode: RenderMode.Server },
  { path: 'app/refer', renderMode: RenderMode.Server },
  { path: 'app/redeem', renderMode: RenderMode.Server },

  //SurveyRoutes
  { path: 'survey', renderMode: RenderMode.Server },
  { path: 'survey/completesurvey', renderMode: RenderMode.Server },
  { path: 'survey/getSurveyInventory', renderMode: RenderMode.Server },
  { path: 'survey/takeSurvey', renderMode: RenderMode.Server },

  // Admin section - optional (can keep Client for security)
  { path: 'admin', renderMode: RenderMode.Client },
  { path: 'admin/user-admin-dashboard', renderMode: RenderMode.Client },

  // Wildcard fallback
  { path: '**', renderMode: RenderMode.Client },
];
