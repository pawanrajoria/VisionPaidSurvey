import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';

/** Sent with sign-up as `acquisition` (SurveyAPI AcquisitionDto). */
export interface IAcquisition {
    source?: string;
    medium?: string;
    campaign?: string;
    content?: string;
    term?: string;
    clickIdType?: string;
    clickId?: string;
    landingPath?: string;
    referrer?: string;
    firstSeenAt?: string;
}

const STORAGE_KEY = 'pp_acquisition';
/** An ad click is credited for this long; after that the visit counts as unattributed. */
const MAX_AGE_DAYS = 90;
const CLICK_ID_PARAMS = ['gclid', 'gbraid', 'wbraid', 'fbclid', 'ttclid', 'msclkid'];

/**
 * Remembers which ad or campaign brought the visitor (utm_* values, ad click id, landing page,
 * outside referrer) so it can be sent with sign-up, often several pages and visits later.
 *
 * Last non-direct touch wins: a visit with campaign values or a click id replaces what was
 * stored, a plain visit (typed URL, bookmark, own pages) never does.
 */
@Injectable({ providedIn: 'root' })
export class AttributionService {
    private readonly isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) platformId: Object, @Inject(DOCUMENT) private document: Document) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    /** Call once on start-up with the URL the visitor landed on. */
    capture(): void {
        if (!this.isBrowser) return;
        try {
            const location = this.document.defaultView!.location;
            const params = new URLSearchParams(location.search);
            const referrer = this.outsideReferrer();

            const touch: IAcquisition = {
                source: this.param(params, 'utm_source'),
                medium: this.param(params, 'utm_medium'),
                campaign: this.param(params, 'utm_campaign'),
                content: this.param(params, 'utm_content'),
                term: this.param(params, 'utm_term'),
            };

            const clickIdType = CLICK_ID_PARAMS.find(p => !!params.get(p));
            if (clickIdType) {
                touch.clickIdType = clickIdType;
                touch.clickId = this.param(params, clickIdType);
                // Auto-tagged ads often carry only the click id.
                touch.source ??= clickIdType === 'fbclid' ? 'facebook' : clickIdType === 'ttclid' ? 'tiktok'
                    : clickIdType === 'msclkid' ? 'bing' : 'google';
                touch.medium ??= 'cpc';
            }

            if (!touch.source && !touch.campaign && !clickIdType) {
                if (!referrer || this.read()) return; // direct visit, or an earlier source is already kept
                // An organic visit from another site (search, Telegram web, a forum).
                touch.source = new URL(referrer).hostname.replace(/^www\./, '');
                touch.medium = 'referral';
            }

            touch.landingPath = (location.pathname + location.search).slice(0, 500);
            touch.referrer = referrer?.slice(0, 500);
            touch.firstSeenAt = new Date().toISOString();

            localStorage.setItem(STORAGE_KEY, JSON.stringify(touch));
        } catch {
            // Storage blocked or a malformed URL - attribution is best-effort only.
        }
    }

    /** The stored source, or undefined when there is none or it is older than MAX_AGE_DAYS. */
    get(): IAcquisition | undefined {
        if (!this.isBrowser) return undefined;
        return this.read();
    }

    private read(): IAcquisition | undefined {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (!raw) return undefined;
            const value = JSON.parse(raw) as IAcquisition;
            const age = Date.now() - new Date(value.firstSeenAt ?? 0).getTime();
            if (!(age >= 0 && age < MAX_AGE_DAYS * 86_400_000)) {
                localStorage.removeItem(STORAGE_KEY);
                return undefined;
            }
            return value;
        } catch {
            return undefined;
        }
    }

    private param(params: URLSearchParams, name: string): string | undefined {
        const value = params.get(name)?.trim();
        return value ? value.slice(0, 255) : undefined;
    }

    private outsideReferrer(): string | undefined {
        const referrer = this.document.referrer;
        if (!referrer) return undefined;
        try {
            return new URL(referrer).hostname === this.document.defaultView!.location.hostname ? undefined : referrer;
        } catch {
            return undefined;
        }
    }
}
