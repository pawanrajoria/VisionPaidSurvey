import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, forkJoin, map, of } from 'rxjs';
import { isPlatformBrowser } from '@angular/common';
import { inject, PLATFORM_ID } from '@angular/core';

export class MultiTranslateHttpLoader implements TranslateLoader {
  private platformId = inject(PLATFORM_ID);

  constructor(
    private http: HttpClient,
    public resources: { prefix: string; suffix: string }[] = [],
  ) { }

  public getTranslation(lang: string): Observable<any> {
    // SSR: don't make HTTP calls to assets
    if (!isPlatformBrowser(this.platformId)) {
      return of({});
    }

    const requests = this.resources.map((config) => {
      const path = `${config.prefix}${lang}${config.suffix}`;
      return this.http.get(path);
    });

    return forkJoin(requests).pipe(
      map((response: any[]) => {
        return response.reduce((acc, current) => ({ ...acc, ...current }), {});
      }),
    );
  }
}
