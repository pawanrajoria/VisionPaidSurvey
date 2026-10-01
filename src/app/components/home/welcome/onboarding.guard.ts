import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { EngagementService } from '../engagement/engagement.service';
import { ONBOARDING_SKIPPED_KEY } from '../engagement/engagement.vm';

/**
 * Sends a user who has not finished the welcome profile to /app/welcome before they
 * reach the Earn page. Fails open: if the API is unreachable, the feature is switched
 * off, or the user chose "later" this session, the Earn page loads normally.
 */
export const onboardingGuard: CanActivateFn = async (_route, state) => {
    if (!isPlatformBrowser(inject(PLATFORM_ID))) return true;

    const router = inject(Router);
    const engagement = inject(EngagementService);

    try {
        if (sessionStorage.getItem(ONBOARDING_SKIPPED_KEY) === '1') return true;
    } catch { /* storage blocked - carry on */ }

    const summary = await engagement.getSummary();
    const onboarding = summary?.onboarding;
    if (!onboarding || !onboarding.available || onboarding.completed) return true;

    const locale = state.url.split('/').filter(Boolean)[0] || 'en-us';
    return router.parseUrl(`/${locale}/app/welcome`);
};
