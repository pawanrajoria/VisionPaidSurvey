import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'auth/signup/:id',
    renderMode: RenderMode.Server, // ✅ SSR per request
  },
  {
    path: 'auth/verify-link/:idve/:idvp',
    renderMode: RenderMode.Server,
  },
  {
    path: 'auth/reset-link/:idve/:idvp',
    renderMode: RenderMode.Server,
  },
  {
    path: 'app/account/transactions/:id',
    renderMode: RenderMode.Server,
  },
  {
    path: '',
    renderMode: RenderMode.Server, // ✅ For static routes like home
  },
  {
    path: '**',
    renderMode: RenderMode.Client, // Optional: for unknown/dynamic routes
  }
];
