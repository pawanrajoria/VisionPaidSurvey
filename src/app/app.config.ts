import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  APP_INITIALIZER,
  inject,
  PLATFORM_ID,
  provideAppInitializer,
  provideBrowserGlobalErrorListeners,
  isDevMode,
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

// ✅ NEW MODULAR FIREBASE IMPORTS
import { initializeApp as provideInit, provideFirebaseApp } from '@angular/fire/app';
import { getAuth, provideAuth } from '@angular/fire/auth';

// ✅ COMPAT FIREBASE IMPORTS
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule, SETTINGS as AUTH_SETTINGS } from '@angular/fire/compat/auth';

import { routes } from './app.routes';
import { ConfigService } from './config.service';
import { authInterceptor } from './components/auth/auth.interceptor';
import { provideServiceWorker } from '@angular/service-worker';
import { environment } from '../environments/environment';
import { RECAPTCHA_V3_SITE_KEY } from 'ng-recaptcha';

const firebaseConfig = {
  apiKey: "AIzaSyBs6AtPBpCdFwQWRdJC0gWvuz6nFxHL-I4",
  authDomain: "visionpaidsurvey.firebaseapp.com",
  projectId: "visionpaidsurvey",
  storageBucket: "visionpaidsurvey.appspot.com",
  messagingSenderId: "988754056043",
  appId: "1:988754056043:web:91671c3ff865fcdc48b22e",
  measurementId: "G-LE58YJQQHT"
};

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
    { prefix: '/assets/i18n/', suffix: '/cookiepolicy.json' },
    { prefix: '/assets/i18n/', suffix: '/instruction.json' },
    { prefix: '/assets/i18n/', suffix: '/afterloginhelp.json' },
  ]);
};

function initTranslateService() {
  const translate = inject(TranslateService);
  translate.setDefaultLang('en');
  return () => Promise.resolve();
}

export const appConfig: ApplicationConfig = {
  providers: [
    { provide: RECAPTCHA_V3_SITE_KEY, useValue: environment.RECAPTCHA_V3_SITE_KEY },
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

    // ✅ MODULAR PROVIDERS (Fixes the NG0201 Error)
    provideFirebaseApp(() => provideInit(firebaseConfig)),
    provideAuth(() => getAuth()),
    // provideMessaging(() => getMessaging()),

    TranslateService,

    importProvidersFrom(
      SharedModule,
      TablerIconsModule.pick(TablerIcons),
      NgScrollbarModule,

      // ✅ COMPAT PROVIDERS (Keeps your existing login working)
      AngularFireModule.initializeApp(firebaseConfig),
      AngularFireAuthModule,

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

    provideServiceWorker('ngsw-worker.js', {
      enabled: false,
      registrationStrategy: 'registerWhenStable:30000'
    }),

    {
      provide: AUTH_SETTINGS,
      useFactory: (platformId: Object) => {
        if (isPlatformBrowser(platformId)) {
          return {};
        }
        return null;
      },
      deps: [PLATFORM_ID],
    },
  ]
};