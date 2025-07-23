import {
  ApplicationConfig,
  provideZoneChangeDetection,
  importProvidersFrom,
  APP_INITIALIZER,
  inject,
  PLATFORM_ID, // Import PLATFORM_ID
  provideAppInitializer,
  provideBrowserGlobalErrorListeners
} from '@angular/core';
import {
  HttpBackend,
  HttpClient,
  provideHttpClient,
  withInterceptors,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { routes } from './app.routes';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
} from '@angular/router';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common'; // Import isPlatformBrowser

import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';


import { TablerIconsModule } from 'angular-tabler-icons';
import * as TablerIcons from 'angular-tabler-icons/icons';


// perfect scrollbar
import { NgScrollbarModule } from 'ngx-scrollbar';

import { SharedModule } from './shared.module';
// REMOVED: import { BrowserAnimationsModule } from '@angular/platform-browser/animations'; // This is browser-specific


import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics"; // Keep import, but use conditionally
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFireAuthModule } from "@angular/fire/compat/auth";
import { Configs, ConfigService } from './config.service';
import { authInterceptor } from './components/auth/auth.interceptor';
import { MultiTranslateHttpLoader } from './multilanguagetranslator';



const firebaseConfig = {
  apiKey: "AIzaSyBs6AtPBpCdFwQWRdJC0gWvuz6nFxHL-I4",
  authDomain: "visionpaidsurvey.firebaseapp.com",
  projectId: "visionpaidsurvey",
  storageBucket: "visionpaidsurvey.firebasestorage.app",
  messagingSenderId: "988754056043",
  appId: "1:988754056043:web:91671c3ff865fcdc48b22e",
  measurementId: "G-LE58YJQQHT"
};

function initConfigService() {
  const configService = inject(ConfigService);
  return configService.loadConfigs(); // Returns a Promise<void>, which is valid
}

// Function to create TranslateHttpLoader
// This loader tells ngx-translate where to find your translation files.
// It assumes your JSON translation files (e.g., en.json, es.json) are located in 'assets/i18n/'.
export function multiHttpLoaderFactory(http: HttpClient) {
  return new MultiTranslateHttpLoader(http, [
    { prefix: './assets/i18n/', suffix: '/common.json' },
    { prefix: './assets/i18n/', suffix: '/roothome.json' },
    { prefix: './assets/i18n/', suffix: '/about.json' },
    { prefix: './assets/i18n/', suffix: '/amazonGiftCard.json' },
    { prefix: './assets/i18n/', suffix: '/cashSurveys.json' },
    { prefix: './assets/i18n/', suffix: '/contact.json' },
    { prefix: './assets/i18n/', suffix: '/personalInformation.json' },
    { prefix: './assets/i18n/', suffix: '/faq.json' },
    { prefix: './assets/i18n/', suffix: '/footer.json' },
    { prefix: './assets/i18n/', suffix: '/giftCardSurveys.json' },
    { prefix: './assets/i18n/', suffix: '/header.json' },
    { prefix: './assets/i18n/', suffix: '/help.json' },
    { prefix: './assets/i18n/', suffix: '/paypalGiftCards.json' },
    { prefix: './assets/i18n/', suffix: '/privacyPolicy.json' },
    { prefix: './assets/i18n/', suffix: '/termsConditions.json' },
    { prefix: './assets/i18n/', suffix: '/visaGiftCards.json' },
    { prefix: './assets/i18n/', suffix: '/auth.json' },
    { prefix: './assets/i18n/', suffix: '/refer.json' },
    { prefix: './assets/i18n/', suffix: '/profile.json' }
    // { prefix: './assets/i18n/', suffix: '/products.json' },
    // Add more resource configurations for other specific JSON files
  ]);
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
    provideHttpClient(withInterceptorsFromDi()),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideClientHydration(withEventReplay()),
    provideAnimationsAsync(), // This is the correct way to provide animations for SSR
    TranslateService,
    importProvidersFrom(
      SharedModule,
      TablerIconsModule.pick(TablerIcons),
      NgScrollbarModule,
      AngularFireAuthModule,
      AngularFireModule.initializeApp(firebaseConfig),
      // Configure ngx-translate module
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: multiHttpLoaderFactory,
          deps: [HttpClient], // Inject HttpClient into our factory
        },
        defaultLanguage: 'en', // Set your default language
      })
    ),
    // Conditionally initialize Firebase Analytics only in the browser
    {
      provide: APP_INITIALIZER,
      useFactory: (platformId: Object) => {
        return () => {
          if (isPlatformBrowser(platformId)) {
            const app = initializeApp(firebaseConfig);
            getAnalytics(app); // Only call getAnalytics in the browser
          }
        };
      },
      deps: [PLATFORM_ID],
      multi: true
    }
  ],
};

// REMOVED: const app = initializeApp(firebaseConfig);
// REMOVED: const analytics = getAnalytics(app); // This was causing the error on the server
