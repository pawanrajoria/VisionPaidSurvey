import { mergeApplicationConfig, ApplicationConfig, inject } from '@angular/core';
import { provideServerRendering, withRoutes } from '@angular/ssr';
import { appConfig } from './app.config';
import { serverRoutes } from './app.routes.server';
import { importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { MultiTranslateServerLoader } from '../../server/multilanguagetranslator.server';
import { HttpClient } from '@angular/common/http';

// ✅ APP_INITIALIZER to preload translations
function initTranslateServiceServer(): () => Promise<void> {
  const translate = inject(TranslateService);
  translate.setDefaultLang('en');
  return () =>
    translate.use('en').toPromise().then(() => {
      console.log('✅ Translations loaded on server');
    });
}


export function multiHttpLoaderFactory() {
  return new MultiTranslateServerLoader([
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

const serverConfig: ApplicationConfig = {
  providers: [
    provideServerRendering(withRoutes(serverRoutes)),
    importProvidersFrom(
      TranslateModule.forRoot({
        loader: {
          provide: TranslateLoader,
          useFactory: multiHttpLoaderFactory,
        },
        defaultLanguage: 'en'
      })
    ),
    {
      provide: APP_INITIALIZER,
      useFactory: initTranslateServiceServer,
      multi: true
    },
  ]
};


export const config = mergeApplicationConfig(appConfig, serverConfig);
