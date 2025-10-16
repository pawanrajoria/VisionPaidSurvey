// import { isPlatformBrowser, isPlatformServer } from '@angular/common';
// import { Inject, Injectable, Optional, PLATFORM_ID } from '@angular/core';

// import { REQUEST } from '@nguniversal/express-engine/tokens'; 
// import type { Request } from 'express';

// @Injectable({ providedIn: 'root' })
// export class LanguageService {
//     constructor(
//         @Inject(PLATFORM_ID) private platformId: Object,
//         @Optional() @Inject(REQUEST) private request: Request | null
//     ) { }

//     getPreferredLanguage(): string {
//         let lang = 'en';

//         // 1. Server-Side Logic (SSR)
//         if (isPlatformServer(this.platformId)) {
//             // The `accept-language` header is only available on the server (via the Request token)
//             const acceptLang = this.request?.headers?.['accept-language'];
//             if (acceptLang) {
//                 // e.g., 'fr-FR,fr;q=0.9,en-US;q=0.8' -> 'fr'
//                 lang = acceptLang.split(',')[0].split('-')[0];
//             }
//             // 2. Browser-Side Logic (CSR)
//         } else if (isPlatformBrowser(this.platformId)) {
//             // `navigator` is only available in the browser
//             const browserLang = navigator.languages?.[0] || navigator.language;
//             lang = browserLang.split('-')[0];
//         }

//         const supported = ['en', 'fr', 'de', 'es', 'hi'];
//         return supported.includes(lang) ? lang : 'en';
//     }
// }