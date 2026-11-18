import { HttpClient } from "@angular/common/http";
import { inject, Injectable, PLATFORM_ID } from "@angular/core";
import { isPlatformBrowser } from "@angular/common";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "../../../../config.service";
import { BACKGROUND } from "../../engagement/engagement.service";

/** GET offer/partner-ratings (SurveyAPI PartnerRatingDto). */
export interface IPartnerRating {
    clientId: number;
    /** null until enough members rated the partner. */
    average: number | null;
    count: number;
    myRating: number | null;
    myRatedAt: string | null;
}

export interface IRatablePartner {
    id: number;
    name: string;
    rating: number;
    ratingCount?: number;
}

/** A member is asked about the same partner again only after this long. */
const ASK_AGAIN_DAYS = 30;
/** Phones open a wall as the page itself: the partner is remembered and asked about when the member returns. */
const PENDING_KEY = 'pp_rate_partner';
const PENDING_MAX_HOURS = 24;

/** Members rate survey / offer partners when they close a wall; the cards show the real average. */
@Injectable({ providedIn: 'root' })
export class PartnerRatingService {
    private readonly http = inject(HttpClient);
    private readonly config = inject(ConfigService);
    private readonly isBrowser = isPlatformBrowser(inject(PLATFORM_ID));

    private ratings = new Map<number, IPartnerRating>();
    /** Partners asked about this visit, so closing the same wall twice does not ask twice. */
    private askedThisVisit = new Set<number>();

    /** Loads the ratings and puts the real averages on the partner cards (fixed numbers stay until enough votes). */
    async load(...partnerLists: IRatablePartner[][]): Promise<void> {
        try {
            const rows = await firstValueFrom(this.http.get<IPartnerRating[]>(this.config.baseUrl + "offer/partner-ratings", BACKGROUND));
            this.ratings = new Map((rows ?? []).map(r => [r.clientId, r]));
        } catch {
            return; // ratings are a nice-to-have: the cards keep their numbers
        }
        for (const list of partnerLists) {
            for (const partner of list) {
                const r = this.ratings.get(partner.id);
                if (r?.average != null) {
                    partner.rating = r.average;
                    partner.ratingCount = r.count;
                }
            }
        }
    }

    /** True when the member has not rated this partner in the last ASK_AGAIN_DAYS days and was not asked this visit. */
    shouldAsk(partnerId: number): boolean {
        if (this.askedThisVisit.has(partnerId)) return false;
        const mine = this.ratings.get(partnerId);
        if (!mine?.myRatedAt) return true;
        return Date.now() - new Date(mine.myRatedAt).getTime() > ASK_AGAIN_DAYS * 86_400_000;
    }

    markAsked(partnerId: number) {
        this.askedThisVisit.add(partnerId);
    }

    async rate(partnerId: number, rating: number): Promise<boolean> {
        try {
            const res = await firstValueFrom(this.http.post<{ isSuccess: boolean }>(this.config.baseUrl + "offer/partner-ratings",
                { clientId: partnerId, rating }, BACKGROUND));
            if (res?.isSuccess) {
                const old = this.ratings.get(partnerId);
                this.ratings.set(partnerId, { clientId: partnerId, average: old?.average ?? null, count: old?.count ?? 0, myRating: rating, myRatedAt: new Date().toISOString() });
            }
            return !!res?.isSuccess;
        } catch {
            return false;
        }
    }

    /** Phones: remember which wall was opened so the member can be asked when they come back. */
    rememberPending(partner: IRatablePartner) {
        if (!this.isBrowser) return;
        try {
            localStorage.setItem(PENDING_KEY, JSON.stringify({ id: partner.id, name: partner.name, at: Date.now() }));
        } catch { /* storage blocked */ }
    }

    /** The wall the member opened before coming back to this page (cleared once read), if recent. */
    takePending(): { id: number; name: string } | null {
        if (!this.isBrowser) return null;
        try {
            const raw = localStorage.getItem(PENDING_KEY);
            if (!raw) return null;
            localStorage.removeItem(PENDING_KEY);
            const value = JSON.parse(raw);
            return Date.now() - (value.at ?? 0) < PENDING_MAX_HOURS * 3_600_000 ? { id: value.id, name: value.name } : null;
        } catch {
            return null;
        }
    }
}
