// lang.redirect.guard.ts
import { inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { supportedLangs } from './components/userflow/const';

export const langRedirectGuard: CanActivateFn = (route, state): boolean | UrlTree => {
    const router = inject(Router);
    const platformId = inject(PLATFORM_ID);
    const url = state.url;

    const segments = url.split('/').filter(s => s.length > 0);
    const firstSegment = segments[0];

    // 1. If it's a valid supported lang, we are good.
    if (supportedLangs.includes(firstSegment)) {
        return true;
    }

    // 2. Determine target language
    let lang = 'en';
    if (isPlatformBrowser(platformId)) {
        lang = localStorage.getItem('lang') || navigator.language.split('-')[0];
        if (!supportedLangs.includes(lang)) lang = 'en';
    }

    // 3. Construct target path
    let targetPath = '';

    // Logic: If the first segment is an invalid 2-letter code, replace it.
    // Otherwise, prepend the language.
    if (firstSegment && firstSegment.length === 2) {
        // Replace invalid lang: /fr/about -> /en/about
        const restOfPath = segments.slice(1).join('/');
        targetPath = `/${lang}/${restOfPath}`;
    } else {
        // Prepend missing lang: /about -> /en/about
        targetPath = `/${lang}${url === '/' ? '' : url}`;
    }

    return router.parseUrl(targetPath);
};