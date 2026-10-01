import { environment } from '../environments/environment';

/**
 * Single source of truth for the public identity of the site.
 * Canonical URLs, hreflang, Open Graph, JSON-LD and the sitemaps are all built from
 * these two values, so switching brand/domain is a one-line change in
 * src/environments/environment.ts instead of a hunt through the code base.
 */
export const SITE_URL: string = (environment.BASE_URL || '').replace(/\/+$/, '');
export const BRAND_NAME: string = (environment as { BRAND_NAME?: string }).BRAND_NAME || 'ProfitPiller';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/assets/images/og-image.png`;

/** Absolute URL for a site path ("/en-us/paypal"). Never ends with a slash, except the bare origin. */
export function absoluteUrl(path: string): string {
  const clean = ('/' + (path || '')).replace(/\/{2,}/g, '/').replace(/\/+$/, '');
  return `${SITE_URL}${clean}`;
}
