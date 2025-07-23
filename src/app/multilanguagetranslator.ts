// src/app/core/i18n/multi-translate-http-loader.ts
import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin, map, Observable } from 'rxjs';

/**
 * Custom TranslateLoader that loads multiple translation files for a given language.
 */
export class MultiTranslateHttpLoader implements TranslateLoader {
    constructor(
        private http: HttpClient,
        public resources: { prefix: string; suffix: string }[] = [],
    ) { }

    public getTranslation(lang: string): Observable<any> {
        const requests = this.resources.map((config) => {
            const path = `${config.prefix}${lang}${config.suffix}`;
            return this.http.get(path);
        });

        // forkJoin waits for all requests to complete and combines their results
        return forkJoin(requests).pipe(
            map((response: any[]) => {
                // Merge all loaded JSON objects into a single object
                return response.reduce((acc, current) => {
                    return { ...acc, ...current };
                }, {});
            }),
        );
    }
}