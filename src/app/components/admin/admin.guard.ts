import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { AdminService } from './admin.service';

/**
 * Keeps non-administrators out of /admin. This is only a convenience for the UI -
 * the API enforces the same rule on every admin endpoint.
 */
export const adminGuard: CanActivateFn = async (_route, state) => {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return false;

    const router = inject(Router);
    const adminService = inject(AdminService);

    if (await adminService.isAdmin()) return true;

    const locale = state.url.split('/').filter(Boolean)[0] || 'en-us';
    return router.parseUrl(`/${locale}/app/earn`);
};
