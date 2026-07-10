// lang.redirect.guard.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { LOCALE_COUNTRY_MAP, SUPPORTED_LOCALE_CODES, SUPPORTED_LOCALES } from './country-langiuage-list';

export const langRedirectGuard: CanActivateFn = (
    route,
    state
): boolean | UrlTree => {

    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);

    const url = state.url;

    const segments = url.split('/').filter(Boolean);
    const locale = segments[0]?.toLowerCase();

    // URL already contains a valid locale
    if (locale && SUPPORTED_LOCALE_CODES.has(locale.toLowerCase())) {
        return true;
    }

    let targetLocale = 'en-us';

    if (isPlatformBrowser(platformId)) {
        ``

        targetLocale =
            localStorage.getItem('locale') ||
            navigator.language.toLowerCase().replace('_', '-');

        if (!SUPPORTED_LOCALE_CODES.has(targetLocale)) {

            const baseLang = targetLocale.split('-')[0];

            targetLocale = LOCALE_COUNTRY_MAP[baseLang]
                ? `${baseLang}-${LOCALE_COUNTRY_MAP[baseLang]}`
                : 'en-us';
        }
    }
    // 1. Create a copy of segments so we don't mutate the original
    let pathSegments = [...segments];

    // 2. Check if the first segment is an existing locale (e.g., "en-us" or "us-uk")
    // If it is 5 characters long and contains a hyphen, we treat it as an old locale to be replaced
    if (pathSegments[0] && pathSegments[0].length === 5 && pathSegments[0].includes('-')) {
        pathSegments.shift(); // This removes the old locale (e.g., "us-uk")
    }

    // 3. Join the remaining path
    const remainingPath = pathSegments.join('/');

    // 4. Return the new URL
    return router.parseUrl(
        `/${targetLocale}${remainingPath ? '/' + remainingPath : ''}`
    );
};