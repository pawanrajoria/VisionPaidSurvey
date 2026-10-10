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
        return response.reduce((acc, current) => deepMerge(acc, current), {});
      }),
    );
  }
}

/**
 * Several files share top-level sections (e.g. "common"); a shallow spread let the last file
 * replace the whole section, so keys from earlier files went missing. Merge nested objects instead.
 */
export function deepMerge(target: any, source: any): any {
  const out: any = { ...target };
  for (const key of Object.keys(source ?? {})) {
    const value = source[key];
    out[key] = value && typeof value === 'object' && !Array.isArray(value)
      && out[key] && typeof out[key] === 'object' && !Array.isArray(out[key])
      ? deepMerge(out[key], value)
      : value;
  }
  return out;
}
