import { ActivatedRoute } from '@angular/router';

/** URL locale slug ("en-us") of the current route, walking up to the `:locale` segment. */
export function routeLocale(route: ActivatedRoute): string {
  let current: ActivatedRoute | null = route;
  while (current) {
    const locale = current.snapshot.paramMap.get('locale');
    if (locale) return locale.toLowerCase();
    current = current.parent;
  }
  return 'en-us';
}

/** Numeric seed for cover art from an id like "blog-123" or "gc-45". */
export function seedFromId(id: string): number {
  const match = id.match(/(\d+)$/);
  return match ? parseInt(match[1], 10) + 1 : 1;
}

export const PLAY_STORE_URL = 'https://play.google.com/store/apps/details?id=com.cralpkresearch.profitpiller';
