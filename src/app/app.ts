import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { ActivatedRoute, NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { SharedModule } from './shared.module';
import { filter, map, mergeMap, Observable } from 'rxjs';
import { LoaderService } from './components/layout/loader.service';
import { SeoService } from './seo.service';
import { TranslateService } from '@ngx-translate/core';
import { HelperService } from './components/root/survey/helper.service';
import { LocalStorageService } from './localstorage.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, SharedModule],
  templateUrl: './app.html',
  styleUrls: ['./app.scss']
})
export class AppComponent implements OnInit {
  title = 'VisionPaidSurvey';
  isLoading$!: Observable<boolean>;

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
    @Inject(PLATFORM_ID) private platformId: Object
  ) {
    this.isLoading$ = this.loader.loading$;
    this.translate.setDefaultLang('en');
    // Use a language from the browser or a stored preference
    const browserLang = translate.getBrowserLang();
    this.translate.use(browserLang?.match(/en|es|fr/) ? browserLang : 'en');
  }


  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      // Run only in browser
      window.addEventListener('scroll', () => {

      });
    }

    this.localStorageService.setItem('LandedUrl', window.location.href);
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
