// src/app/app.config.ts

import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  APP_INITIALIZER,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
} from '@angular/core';

import {
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
  withFetch,
  HttpClient,
} from '@angular/common/http';

import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';

import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MultiTranslateClientHttpLoader } from './multilanguagetranslator';

import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';

import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from './shared.module';

import { initializeApp } from 'firebase/app';
import { getAnalytics } from 'firebase/analytics';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from '@angular/fire/compat/auth';

import { routes } from './app.routes';
import { ConfigService } from './config.service';
import { authInterceptor } from './components/auth/auth.interceptor';

// ✅ Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBs6AtPBpCdFwQWRdJC0gWvuz6nFxHL-I4",
  authDomain: "visionpaidsurvey.firebaseapp.com",
  projectId: "visionpaidsurvey",
  storageBucket: "visionpaidsurvey.appspot.com",
  messagingSenderId: "988754056043",
  appId: "1:988754056043:web:91671c3ff865fcdc48b22e",
  measurementId: "G-LE58YJQQHT"
};

// ✅ App Config Initialization
function initConfigService() {
  const configService = inject(ConfigService);
  return configService.loadConfigs();
}

export function multiHttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateClientHttpLoader(http, [
    { prefix: '/assets/i18n/', suffix: '/common.json' },
    { prefix: '/assets/i18n/', suffix: '/roothome.json' },
    { prefix: '/assets/i18n/', suffix: '/about.json' },
    { prefix: '/assets/i18n/', suffix: '/amazonGiftCard.json' },
    { prefix: '/assets/i18n/', suffix: '/cashSurveys.json' },
    { prefix: '/assets/i18n/', suffix: '/contact.json' },
    { prefix: '/assets/i18n/', suffix: '/personalInformation.json' },
    { prefix: '/assets/i18n/', suffix: '/faq.json' },
    { prefix: '/assets/i18n/', suffix: '/footer.json' },
    { prefix: '/assets/i18n/', suffix: '/giftCardSurveys.json' },
    { prefix: '/assets/i18n/', suffix: '/header.json' },
    { prefix: '/assets/i18n/', suffix: '/help.json' },
    { prefix: '/assets/i18n/', suffix: '/paypalGiftCards.json' },
    { prefix: '/assets/i18n/', suffix: '/privacyPolicy.json' },
    { prefix: '/assets/i18n/', suffix: '/termsConditions.json' },
    { prefix: '/assets/i18n/', suffix: '/visaGiftCards.json' },
    { prefix: '/assets/i18n/', suffix: '/auth.json' },
    { prefix: '/assets/i18n/', suffix: '/refer.json' },
    { prefix: '/assets/i18n/', suffix: '/profile.json' },
  ]);
};

// ✅ APP_INITIALIZER to preload translations
function initTranslateService(): () => Promise<void> {
  const translate = inject(TranslateService);
  translate.setDefaultLang('en');
  return () => translate.use('en').toPromise().then(() => {});
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideAppInitializer(initConfigService),
    provideZoneChangeDetection({ eventCoalescing: true }),

    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      withComponentInputBinding()
    ),

    provideHttpClient(
      withFetch(),
      withInterceptorsFromDi(),
      withInterceptors([authInterceptor])
    ),

    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(),

    TranslateService,

    importProvidersFrom(
      SharedModule,
      TablerIconsModule.pick(TablerIcons),
      NgScrollbarModule,
      AngularFireAuthModule,
      AngularFireModule.initializeApp(firebaseConfig),
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: multiHttpLoaderFactory,
          deps: [HttpClient, PLATFORM_ID],
        },
        defaultLanguage: 'en'
      })
    ),

    {
      provide: APP_INITIALIZER,
      useFactory: initTranslateService,
      multi: true
    },

    {
      provide: APP_INITIALIZER,
      useFactory: (platformId: Object) => {
        return () => {
          if (isPlatformBrowser(platformId)) {
            const app = initializeApp(firebaseConfig);
            getAnalytics(app);
          }
        };
      },
      deps: [PLATFORM_ID],
      multi: true
    }
  ]
};