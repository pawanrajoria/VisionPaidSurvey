// @ts-ignore
// @angular/ssr-client-only
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
import path from 'node:path';
import * as fs from 'node:fs';

export class MultiTranslateServerLoader implements TranslateLoader {
  constructor(
    private resources: { prefix: string; suffix: string }[] = []
  ) { }
  public getTranslation(lang: string): Observable<any> {
    const translations: any = {};
    const projectName = 'visionpaidsurvey';
    const baseDir = path.join(process.cwd(), 'dist', projectName, 'browser');

    this.resources.forEach((config) => {
      let filePath: string = '';
      try {
        filePath = path.join(baseDir, config.prefix, `${lang}${config.suffix}`);
        const fileContents = fs.readFileSync(filePath, 'utf8');
        Object.assign(translations, JSON.parse(fileContents));
      } catch (e) {
        console.error(`Could not load translation file on server from path: ${filePath}`);
      }
    });

    return of(translations);
  }
}