import { inject, PLATFORM_ID, REQUEST } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { CanActivateFn, Router } from '@angular/router';
import { LOCALE_COUNTRY_MAP, SUPPORTED_LOCALE_CODES } from './country-langiuage-list';
import { TRANSLATED_LANGUAGES } from './i18n-languages';

/** "hi-IN" / "hi" -> "hi-in"; unknown -> null. Only languages the site is translated into. */
function toLocale(tag: string | null | undefined): string | null {
    const value = (tag ?? '').trim().toLowerCase().replace('_', '-');
    if (!value) return null;
    if (SUPPORTED_LOCALE_CODES.has(value) && (TRANSLATED_LANGUAGES as readonly string[]).includes(value.split('-')[0])) return value;
    const base = value.split('-')[0];
    if (!(TRANSLATED_LANGUAGES as readonly string[]).includes(base)) return null;
    const fallback = `${base}-${LOCALE_COUNTRY_MAP[base] ?? 'us'}`;
    return SUPPORTED_LOCALE_CODES.has(fallback) ? fallback : null;
}

/**
 * The bare domain ("/") used to always go to /en-us. It now opens in the language the visitor
 * chose before, else their browser language (Accept-Language on the server), else English.
 */
export const rootLocaleGuard: CanActivateFn = () => {
    const router = inject(Router);
    let locale: string | null = null;

    if (isPlatformBrowser(inject(PLATFORM_ID))) {
        try { locale = toLocale(localStorage.getItem('locale')); } catch { /* storage blocked */ }
        for (const tag of navigator.languages ?? [navigator.language]) {
            if (locale) break;
            locale = toLocale(tag);
        }
    } else {
        const header = inject(REQUEST, { optional: true })?.headers.get('accept-language') ?? '';
        for (const part of header.split(',')) {
            locale = toLocale(part.split(';')[0]);
            if (locale) break;
        }
    }

    return router.parseUrl(`/${locale ?? 'en-us'}`);
};
