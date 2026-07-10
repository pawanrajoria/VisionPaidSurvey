import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, Observable } from 'rxjs';
import { SharedModule } from './shared.module';
import { LoaderService } from './components/layout/loader.service';
import { SeoService } from './seo.service';
import { TranslateService } from '@ngx-translate/core';
import { HelperService } from './components/userflow/helper.service';
import { LocalStorageService } from './localstorage.service';
import { BaseComponent } from './base.component';
import { GoogleService } from './components/auth/google.service';
import { VersionCheckService } from './version-check.service';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AuthService } from './components/auth/auth.service';
import { LOCALE_COUNTRY_MAP, SUPPORTED_LOCALE_CODES } from './country-langiuage-list';
import { GtmService } from './gtm.service';
import { isPlatformBrowser } from '@angular/common';

function resolveLocaleSlug(rawLang: string): string {
  const normalised = rawLang.toLowerCase().replace('_', '-'); // "en-US" → "en-us"

  // Full match in map (e.g. "en-gb")
  if (LOCALE_COUNTRY_MAP[normalised]) {
    return normalised; // already "en-gb"
  }

  // Has a country part but not in map → keep it as-is
  if (normalised.includes('-')) {
    return normalised; // e.g. "fr-ch"
  }

  // Bare base lang (e.g. "en", "hi", "de")
  const mapped = LOCALE_COUNTRY_MAP[normalised];
  if (mapped) {
    return `${normalised}-${mapped}`; // "de" → "de-de"
  }

  // Final fallback
  return 'en-us';
}

/**
 * Extract the locale-country slug from a URL path.
 * Supports both old format ("/en/...") and new format ("/en-us/...").
 *
 * Returns { locale: 'en-us', cleanPath: '/dashboard' }
 */
function parseLocaleFromUrl(url: string): { locale: string; cleanPath: string } {
  // New format: /en-us/... or /hi-in/...
  const newFormat = url.match(/^\/(([a-z]{2})-([a-z]{2}))(\/.*)?$/);
  if (newFormat) {
    return {
      locale: newFormat[1],          // "en-us"
      cleanPath: newFormat[4] || '/' // "/dashboard"
    };
  }

  // Old / legacy format: /en/... or /hi/...
  const oldFormat = url.match(/^\/(en|hi)(\/.*)?$/);
  if (oldFormat) {
    // Upgrade bare lang to full locale slug
    const upgraded = resolveLocaleSlug(oldFormat[1]);
    return {
      locale: upgraded,
      cleanPath: oldFormat[2] || '/'
    };
  }

  return { locale: 'en-us', cleanPath: url };
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent extends BaseComponent implements OnInit {
  title = 'VisionPaidSurvey';
  isLoading$!: Observable<boolean>;
  translationsLoaded = false;

  constructor(
    private loader: LoaderService,
    private router: Router,
    private titleService: Title,
    private metaService: Meta,
    private seoService: SeoService,
    private translate: TranslateService,
    private helperService: HelperService,
    private localStorageService: LocalStorageService,
    private versionCheck: VersionCheckService,
    private angularFireAuth: AngularFireAuth,
    private authService: AuthService,
    private gtm: GtmService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super();
    this.isLoading$ = this.loader.loading$;
    this.versionCheck.check();
    this.translate.setDefaultLang('en');
  }

  async ngOnInit() {
    // ✅ SSR-safe: store landing URL
    if (this.isBrowser && this.win) {
      this.localStorageService.setItem('LandedUrl', this.win.location.href);
    }

    await this.helperService.getOrInitializeDuid();

    this.detectAndSetLanguage();


    // ─── Router events: update SEO + hreflang on every navigation ───────────

    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => {
        if (isPlatformBrowser(this.platformId)) {
          this.gtm.pushEvent('page_view', {
            page_location: this.gtm.location,
            page_title: this.gtm.title,
            page_path: event.urlAfterRedirects
          });
        }

        const { locale, cleanPath } = parseLocaleFromUrl(event.urlAfterRedirects);
        const baseLang = locale.split('-')[0];

        if (SUPPORTED_LOCALE_CODES.has(baseLang)) {
          this.translate.use(baseLang);
          this.localStorageService.setItem('lang', baseLang);
          this.localStorageService.setItem('locale', locale);
        }

        const pageTitle = this.titleService.getTitle() || 'ProfitPiller';
        const description = this.metaService.getTag('name=description')?.content || pageTitle;

        this.seoService.updateMetaData(
          pageTitle,
          description,
          `https://profitpiller.com/${locale}${cleanPath}`,
          undefined,
          locale
        );
        this.seoService.updateHreflang(cleanPath, locale);
      });

    // ─── Handle Google OAuth redirect hash ──────────────────────────────────
    if (this.isBrowser && this.win) {
      const hash = window.location.hash;
      if (hash.includes('access_token=')) {
        const params = new URLSearchParams(hash.substring(1));
        const token = params.get('access_token');
        if (token) {
          this.completeGoogleLogin(token);
        }
      }
    }
  }

  // ─── Language switcher ────────────────────────────────────────────────────
  changeLanguage(lang: string) {
    this.translate.use(lang);
  }

  // ─── Detect browser locale and load the right translation ────────────────
  private detectAndSetLanguage(): void {
    if (!this.isBrowser) return;

    let locale: string | null = null;

    // 1. Check URL first
    const path = window.location.pathname;
    const segments = path.split('/').filter(Boolean);

    if (
      segments.length > 0 &&
      SUPPORTED_LOCALE_CODES.has(segments[0].toLowerCase())
    ) {
      locale = segments[0].toLowerCase();
    }

    // 2. Check stored locale
    if (!locale) {
      const storedLocale = localStorage.getItem('locale');
      if (
        storedLocale &&
        SUPPORTED_LOCALE_CODES.has(storedLocale.toLowerCase())
      ) {
        locale = storedLocale.toLowerCase();
      }
    }

    // 3. Check stored language
    if (!locale) {
      const storedLang = localStorage.getItem('lang');
      if (storedLang) {
        locale = resolveLocaleSlug(storedLang);
      }
    }

    // 4. Browser language fallback
    if (!locale) {
      const browserLang = navigator.language || 'en-US';
      locale = resolveLocaleSlug(browserLang);
    }

    // Final safety fallback
    if (!locale || !SUPPORTED_LOCALE_CODES.has(locale)) {
      locale = 'en-us';
    }

    const baseLang = locale.split('-')[0];

    this.translate.use(baseLang).subscribe({
      next: () => {
        console.log(
          `Translations loaded for: ${baseLang} (locale: ${locale})`
        );

        this.translationsLoaded = true;

        this.localStorageService.setItem('lang', baseLang);
        this.localStorageService.setItem('locale', locale);
      },
      error: (err) => console.error('Failed to load translations', err)
    });
  }
  // ─── Complete Google OAuth sign-in ────────────────────────────────────────
  async completeGoogleLogin(googleToken: string) {
    const credential = GoogleAuthProvider.credential(null, googleToken);
    const userCredential = await this.angularFireAuth.signInWithCredential(credential);

    if (userCredential?.user) {
      const idToken = await userCredential.user.getIdToken();

      await this.authService.firebaseLogin({
        idToken: idToken,
        fullName: userCredential.user?.displayName,
        userId: userCredential.user?.uid,
        imageSrc: userCredential.user?.photoURL,
        emailVerified: userCredential.user?.emailVerified,
        phoneNumber: userCredential.user?.phoneNumber,
        bonusCode: this.localStorageService.getItem('bonusCode') || ''
      });
    }
  }
}

