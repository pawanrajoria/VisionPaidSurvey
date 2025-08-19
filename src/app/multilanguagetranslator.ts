// src/app/multilanguagetranslator.ts

import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, forkJoin, map } from 'rxjs';

export class MultiTranslateClientHttpLoader implements TranslateLoader {
  constructor(
    private http: HttpClient,
    public resources: { prefix: string; suffix: string }[] = [],
  ) {}

  public getTranslation(lang: string): Observable<any> {
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