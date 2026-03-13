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
     this.translate.use('en');
    // const browserLang = this.isBrowser ? this.translate.getBrowserLang() : 'en';
    // this.translate.setDefaultLang('en');

    // this.translate.use(browserLang?.match(/en|es|fr/) ? browserLang : 'en').subscribe(() => {
    //   // // ✅ FIX: If we are on the server, set this to true immediately.
    //   // // The server doesn't need the 100ms timeout.
    //   // if (!this.isBrowser) {
    //   //   this.translationsLoaded = true;
    //   // } else {
    //   //   // Browser logic remains the same
    //   //   setTimeout(() => {
    //   //     this.translationsLoaded = true;
    //   //   }, 100);
    //   // }
    // });
  }

  ngOnInit() {
    // ✅ SSR-safe check before using `window`
    if (this.isBrowser && this.win) {
      this.localStorageService.setItem('LandedUrl', this.win.location.href);
    }

    this.helperService.setDuid();



    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let route = this.activatedRoute;
          while (route.firstChild) route = route.firstChild;
          return route;
        }),
        filter((route) => route.outlet === 'primary'),
        mergeMap((route) => route.data)
      )
      .subscribe((data) => {
        const title = data['title'] || 'Profitpiller';
        const description = data['description'] || title;
        this.seoService.updateMetaData(title, description);
      });
  }

  changeLanguage(lang: string) {
    this.translate.use(lang);
  }
}
