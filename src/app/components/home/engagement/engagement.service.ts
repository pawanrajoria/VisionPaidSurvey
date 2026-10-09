import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "../../../config.service";
import { IBonusResult, ICompleteOnboardingRequest, IEngagementSummary, ILeaderboard, IPriorityOffer, IUserSettings } from "./engagement.vm";

/** Calls made with this header never show the full-screen loader or an error toast. */
export const BACKGROUND = { headers: new HttpHeaders({ 'X-Background': 'true' }) };

@Injectable({ providedIn: 'root' })
export class EngagementService {
    private summary: IEngagementSummary | null = null;
    private pending: Promise<IEngagementSummary | null> | null = null;

    constructor(private http: HttpClient, private config: ConfigService) { }

    /**
     * Onboarding + daily check-in + checklist in one request. Cached for the session so the
     * route guard and the Earn page share a single call; pass refresh=true after a change.
     * Resolves to null (never throws) when the API is unreachable.
     */
    async getSummary(refresh = false): Promise<IEngagementSummary | null> {
        if (this.summary && !refresh) return this.summary;
        if (this.pending && !refresh) return this.pending;

        this.pending = firstValueFrom(
            this.http.get<IEngagementSummary>(this.config.baseUrl + "engagement/summary", BACKGROUND)
        ).then(result => {
            this.summary = result ?? null;
            return this.summary;
        }).catch(() => null).finally(() => { this.pending = null; });

        return this.pending;
    }

    clear(): void {
        this.summary = null;
        this.pending = null;
    }

    async completeOnboarding(request: ICompleteOnboardingRequest): Promise<IBonusResult> {
        const result = await firstValueFrom(
            this.http.post<IBonusResult>(this.config.baseUrl + "engagement/complete-onboarding", request));
        if (result?.isSuccess) this.clear();
        return result;
    }

    async dailyCheckin(): Promise<IBonusResult> {
        const result = await firstValueFrom(
            this.http.post<IBonusResult>(this.config.baseUrl + "engagement/daily-checkin", {}));
        this.clear();
        return result;
    }

    /** Spends one earned weekly-streak prize draw. */
    async streakDraw(): Promise<IBonusResult> {
        const result = await firstValueFrom(
            this.http.post<IBonusResult>(this.config.baseUrl + "engagement/streak-draw", {}));
        this.clear();
        return result;
    }

    async getLeaderboard(): Promise<ILeaderboard | null> {
        try {
            return await firstValueFrom(
                this.http.get<ILeaderboard>(this.config.baseUrl + "engagement/leaderboard", BACKGROUND));
        } catch {
            return null;
        }
    }

    async getSettings(): Promise<IUserSettings | null> {
        try {
            return await firstValueFrom(
                this.http.get<IUserSettings>(this.config.baseUrl + "engagement/settings", BACKGROUND));
        } catch {
            return null;
        }
    }

    async setTimeZone(timeZone: string | null): Promise<{ isSuccess: boolean; message: string }> {
        return await firstValueFrom(
            this.http.post<{ isSuccess: boolean; message: string }>(this.config.baseUrl + "engagement/timezone", { timeZone }));
    }

    async getPriorityOffers(): Promise<IPriorityOffer[]> {
        try {
            return await firstValueFrom(
                this.http.get<IPriorityOffer[]>(this.config.baseUrl + "offer/get-priority-offers", BACKGROUND)) ?? [];
        } catch {
            return [];
        }
    }

    async trackPriorityClick(id: number): Promise<IPriorityOffer | null> {
        try {
            return await firstValueFrom(
                this.http.post<IPriorityOffer>(this.config.baseUrl + "offer/priority-click/" + id, {}, BACKGROUND));
        } catch {
            return null;
        }
    }
}
