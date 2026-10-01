/**
 * Languages that actually have translation files under src/assets/i18n/<code>/.
 * The site accepts many more locale URLs (en-gb, sv-se, ar-ae, ...); a locale whose
 * language is not listed here is shown in English instead of requesting files that
 * do not exist.
 *
 * To add a language: create the folder with the same JSON files as "en" and add its
 * code here.
 */
export const TRANSLATED_LANGUAGES = ['en', 'de', 'es', 'fr', 'hi', 'it', 'ka', 'ms', 'nl', 'pt', 'zh'] as const;

export const DEFAULT_LANGUAGE = 'en';

/** "de-de" / "de" / "/de-de/app/earn" -> "de"; unknown or untranslated -> "en". */
export function languageForLocale(localeOrPath: string | null | undefined): string {
  const first = (localeOrPath ?? '').replace(/^\/+/, '').split(/[/?#]/)[0].toLowerCase();
  const base = first.replace('_', '-').split('-')[0];
  return (TRANSLATED_LANGUAGES as readonly string[]).includes(base) ? base : DEFAULT_LANGUAGE;
}
