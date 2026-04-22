import {
  Component,
  Inject,
  OnInit,
  PLATFORM_ID
} from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, mergeMap, Observable } from 'rxjs';
import { SharedModule } from './shared.module';
import { LoaderService } from './components/layout/loader.service';
import { SeoService } from './seo.service';
import { TranslateService } from '@ngx-translate/core';
import { HelperService } from './components/userflow/helper.service';
import { LocalStorageService } from './localstorage.service';
import { BaseComponent } from './base.component';
import { GoogleService } from './components/auth/google.service';
import { VersionCheckService } from './version-check.service';
import { RecaptchaV3Module } from 'ng-recaptcha';
import { supportedLangs } from './components/userflow/const';

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
    private activatedRoute: ActivatedRoute,
    private titleService: Title,
    private metaService: Meta,
    private seoService: SeoService,
    private translate: TranslateService,
    private helperService: HelperService,
    private localStorageService: LocalStorageService,
    private googleService: GoogleService,
    private versionCheck: VersionCheckService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    super();
    this.isLoading$ = this.loader.loading$;
    this.versionCheck.check();
    this.translate.setDefaultLang('en');
  }

  ngOnInit() {
    // ✅ SSR-safe check before using `window`
    if (this.isBrowser && this.win) {
      this.localStorageService.setItem('LandedUrl', this.win.location.href);

    }

    this.helperService.setDuid();

    this.detectAndSetLanguage();

    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd)
      )
      .subscribe(() => {

        const urlSegments = this.router.url.split('/');
        const langInUrl = urlSegments[1];

        if (supportedLangs.includes(langInUrl)) {
          this.translate.use(langInUrl);
          this.localStorageService.setItem('lang', langInUrl);
        }


        const fullUrl = this.router.url;
        // Extract lang (en / hi)
        const langMatch = fullUrl.match(/^\/(en|hi)/);
        const lang = langMatch ? langMatch[1] : 'en';
        // Remove lang from path
        const cleanPath = fullUrl.replace(/^\/(en|hi)/, '');

        const title = this.titleService.getTitle() || 'Profitpiller';
        const description = this.metaService.getTag('name=description')?.content || title;

        // ✅ Update SEO
        this.seoService.updateMetaData(
          title,
          description,
          `https://profitpiller.com/${lang}${cleanPath}`
        );

        // ✅ Add hreflang
        this.seoService.updateHreflang(cleanPath);
      });
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }


  private detectAndSetLanguage(): void {
    if (!this.isBrowser) return;

    let langCode = localStorage.getItem('lang') || navigator.language.split('-')[0];

    if (!supportedLangs.includes(langCode)) {
      langCode = 'en';
    }

    // ✅ Force ngx-translate to switch
    this.translate.use(langCode).subscribe({
      next: () => {
        console.log(`Translations loaded for: ${langCode}`);
        this.translationsLoaded = true;
      },
      error: (err) => console.error('Failed to load translations', err)
    });
  }


  // private detectAndSetLanguage(): void {
  //   if (!this.isBrowser) return;

  //   const supportedLangs = ['en', 'hi']; // 👈 add more if needed

  //   let lang = navigator.language || navigator.languages?.[0] || 'en';
  //   let langCode = lang.split('-')[0];

  //   if (!supportedLangs.includes(langCode)) {
  //     langCode = 'en';
  //   }

  //   const currentUrl = this.router.url;
  //   // Check if URL already has language prefix
  //   const hasLangPrefix = supportedLangs.some(l => currentUrl.startsWith(`/${l}`));
  //   // 👉 Set language in ngx-translate
  //   this.translate.use(langCode);
  //   // 👉 Save to local storage (optional)
  //   this.localStorageService.setItem('lang', langCode);
  //   // 👉 Append language to URL if not present
  //   if (!hasLangPrefix) {
  //     this.router.navigate([`/${langCode}${currentUrl}`]);
  //   }
  // }
}
