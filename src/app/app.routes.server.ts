import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  // 🌍 SSR ONLY SEO PAGES
  { path: ':lang', renderMode: RenderMode.Server },
  { path: ':lang/aboutus', renderMode: RenderMode.Server },
  { path: ':lang/contactus', renderMode: RenderMode.Server },
  { path: ':lang/privacy-policy', renderMode: RenderMode.Server },
  { path: ':lang/terms-conditions', renderMode: RenderMode.Server },
  { path: ':lang/cookie-policy', renderMode: RenderMode.Server },

  { path: ':lang/amazongiftcard', renderMode: RenderMode.Server },
  { path: ':lang/cashout', renderMode: RenderMode.Server },
  { path: ':lang/do-not-sell', renderMode: RenderMode.Server },
  { path: ':lang/giftcard', renderMode: RenderMode.Server },
  { path: ':lang/help', renderMode: RenderMode.Server },
  { path: ':lang/paypal', renderMode: RenderMode.Server },
  { path: ':lang/visa', renderMode: RenderMode.Server },

  // 🔐 AUTH (optional SSR)
  { path: ':lang/auth/**', renderMode: RenderMode.Server },

  // 🚫 CLIENT ONLY
  { path: ':lang/app/**', renderMode: RenderMode.Client },
  { path: ':lang/admin/**', renderMode: RenderMode.Client },
  { path: ':lang/survey/**', renderMode: RenderMode.Client },
  { path: ':lang/offerwall/**', renderMode: RenderMode.Client },

  // 🚫 FALLBACK
  { path: '**', renderMode: RenderMode.Client },
];