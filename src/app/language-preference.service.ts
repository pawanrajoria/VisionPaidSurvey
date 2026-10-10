import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NavigationEnd, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { filter, firstValueFrom, take } from 'rxjs';
import { ConfigService } from './config.service';
import { LOCALE_COUNTRY_MAP, SUPPORTED_LOCALE_CODES } from './country-langiuage-list';
import { DEFAULT_LANGUAGE, languageForLocale, TRANSLATED_LANGUAGES } from './i18n-languages';

const BACKGROUND = { headers: new HttpHeaders({ 'X-Background': 'true' }) };
/** Session marker: the account's saved language was already applied (or asked for) after this sign-in. */
const SYNCED_KEY = 'lang_synced_token';

/**
 * The member's language, kept in three places so it never "falls back":
 *  - the URL locale (/hi-in/app/...) - every page and every refresh reads the language from it;
 *  - localStorage (locale/lang) - used when a URL has no locale (e.g. the bare domain);
 *  - the account (engagement/language) - so another browser or the app opens in it too.
 * Without a choice the browser language is used. After signing in, a member who never chose
 * is asked once; a member who chose before gets that language straight away.
 */
@Injectable({ providedIn: 'root' })
export class LanguagePreferenceService {
    private readonly router = inject(Router);
    private readonly translate = inject(TranslateService);
    private readonly http = inject(HttpClient);
    private readonly config = inject(ConfigService);
    private readonly dialog = inject(MatDialog);
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    /** "hi" + "IN" -> "hi-in"; a pair the site has no URL for falls back to the language's default country. */
    localeFor(language: string, countryCode?: string | null): string {
        const lang = (TRANSLATED_LANGUAGES as readonly string[]).includes(language) ? language : DEFAULT_LANGUAGE;
        const wanted = countryCode ? `${lang}-${countryCode.toLowerCase()}` : '';
        if (wanted && SUPPORTED_LOCALE_CODES.has(wanted)) return wanted;
        const fallback = `${lang}-${LOCALE_COUNTRY_MAP[lang] ?? 'us'}`;
        return SUPPORTED_LOCALE_CODES.has(fallback) ? fallback : 'en-us';
    }

    /** Locale slug of the page being shown. */
    get currentLocale(): string {
        const first = this.router.url.split(/[/?#]/).filter(Boolean)[0]?.toLowerCase();
        return first && SUPPORTED_LOCALE_CODES.has(first) ? first : 'en-us';
    }

    /**
     * Switches the whole site to `language`: same page under the new locale URL, remembered in
     * this browser and (when signed in and `save`) on the account.
     */
    async apply(language: string, countryCode?: string | null, save = true): Promise<void> {
        const locale = this.localeFor(language, countryCode);
        const lang = languageForLocale(locale);

        if (this.isBrowser) {
            try {
                localStorage.setItem('locale', locale);
                localStorage.setItem('lang', lang);
            } catch { /* storage blocked */ }
        }

        await firstValueFrom(this.translate.use(lang)).catch(() => undefined);

        const current = this.router.url;
        const rest = current.replace(/^\/[a-z]{2}-[a-z]{2}(?=\/|\?|#|$)/i, '');
        const target = `/${locale}${rest === '/' ? '' : rest}`;
        if (target !== current) {
            await this.router.navigateByUrl(target, { replaceUrl: true });
        }

        if (save && this.isSignedIn) {
            this.http.post(this.config.baseUrl + 'engagement/language', { language: lang }, BACKGROUND)
                .subscribe({ error: () => { /* kept in this browser; saved next time */ } });
        }
    }

    /**
     * Called when the signed-in area loads. Once per sign-in: applies the account's language, or
     * asks a member who never picked one (the browser language is pre-selected).
     */
    async syncAfterSignIn(openPicker: () => Promise<string | null>): Promise<void> {
        if (!this.isBrowser || !this.isSignedIn) return;
        const token = this.tokenTail;
        try { if (sessionStorage.getItem(SYNCED_KEY) === token) return; } catch { /* storage blocked */ }

        // Wait until the first page is on screen so the locale in the URL is final.
        if (!this.router.navigated) {
            await firstValueFrom(this.router.events.pipe(filter(e => e instanceof NavigationEnd), take(1)));
        }

        let saved: string | null = null;
        let reached = false;
        try {
            const settings = await firstValueFrom(
                this.http.get<{ preferredLanguage?: string | null }>(this.config.baseUrl + 'engagement/settings', BACKGROUND));
            saved = settings?.preferredLanguage ?? null;
            reached = true;
        } catch {
            return; // try again on the next page load
        }

        try { sessionStorage.setItem(SYNCED_KEY, token); } catch { /* storage blocked */ }

        if (saved && (TRANSLATED_LANGUAGES as readonly string[]).includes(saved)) {
            if (languageForLocale(this.currentLocale) !== saved) {
                await this.apply(saved, null, false);
            }
            return;
        }

        if (!reached) return;
        // Never chosen: ask once. Closing the dialog keeps (and saves) the language in use.
        const picked = await openPicker();
        if (!picked) {
            await this.apply(languageForLocale(this.currentLocale), this.currentLocale.split('-')[1], true);
        }
    }

    private get isSignedIn(): boolean {
        if (!this.isBrowser) return false;
        try { return !!localStorage.getItem('token'); } catch { return false; }
    }

    private get tokenTail(): string {
        try { return (localStorage.getItem('token') ?? '').slice(-24); } catch { return ''; }
    }
}
