// @ts-ignore
// @angular/ssr-client-only
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import path from 'node:path';
import * as fs from 'node:fs';

export class MultiTranslateServerLoader implements TranslateLoader {
  constructor(private resources: { prefix: string; suffix: string }[] = []) { }

  public getTranslation(lang: string): Observable<any> {
    const translations: any = {};

    // ✅ Fix: Use __dirname or import.meta.dirname to find the actual location
    // Typically in Firebase: /functions/dist/projectName/server/
    // So we go up one level to reach 'browser'
    const serverDir = import.meta.dirname;
    const baseDir = path.resolve(serverDir, '..', 'browser');

    this.resources.forEach((config) => {
      let filePath: string = '';
      try {
        // config.prefix is '/assets/i18n/', but path.join handles slashes
        filePath = path.join(baseDir, config.prefix, lang, config.suffix);

        // Debugging: If this fails, this log will show up in Firebase Console
        if (fs.existsSync(filePath)) {
          const fileContents = fs.readFileSync(filePath, 'utf8');
          Object.assign(translations, JSON.parse(fileContents));
        } else {
        }
      } catch (e) {
      }
    });

    return of(translations);
  }
}