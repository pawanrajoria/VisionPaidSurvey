import { HttpClient, HttpParams } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "../../config.service";
import { BACKGROUND } from "../home/engagement/engagement.service";
import { AdminOverviewDto, AdminPayoutDto, AdminUserListDto, BulkUserActionResultDto, NotificationAudienceDto, PriorityOfferAdminDto, SendNotificationRequest, SendNotificationResult } from "./admin.vm";

@Injectable({ providedIn: 'root' })
export class AdminService {
    private adminFlag: boolean | null = null;

    constructor(private http: HttpClient, private config: ConfigService) {
    }

    private get base(): string { return this.config.baseUrl + "admin/"; }

    /** Cached for the session; false when the call fails. */
    async isAdmin(): Promise<boolean> {
        if (this.adminFlag !== null) return this.adminFlag;
        try {
            const response = await firstValueFrom(this.http.get<{ isAdmin: boolean }>(this.base + "me", BACKGROUND));
            this.adminFlag = !!response?.isAdmin;
        } catch {
            return false;
        }
        return this.adminFlag;
    }

    clear(): void { this.adminFlag = null; }

    async getDashboardHistory(timeperiod: string): Promise<any> {
        const params = new HttpParams().set('timeperiod', timeperiod);
        return await firstValueFrom(this.http.get<any>(this.base + "get-dashboard-history", { params }));
    }

    async getOverview(): Promise<AdminOverviewDto> {
        return await firstValueFrom(this.http.get<AdminOverviewDto>(this.base + "overview"));
    }

    async getUsers(search: string, status: number | null, minRejection: number | null, page: number, pageSize: number): Promise<AdminUserListDto> {
        let params = new HttpParams().set('page', page).set('pageSize', pageSize);
        if (search.trim()) params = params.set('search', search.trim());
        if (status !== null) params = params.set('status', status);
        if (minRejection !== null) params = params.set('minRejection', minRejection);
        return await firstValueFrom(this.http.get<AdminUserListDto>(this.base + "users", { params }));
    }

    async setUserBlocked(userId: number, blocked: boolean): Promise<{ isSuccess: boolean; message: string }> {
        return await firstValueFrom(this.http.post<any>(`${this.base}users/${userId}/block`, { blocked }));
    }

    /** Disables the selected high-rejection users and emails each one the reason. */
    async blockHighRejectionUsers(userIds: number[]): Promise<BulkUserActionResultDto> {
        return await firstValueFrom(this.http.post<BulkUserActionResultDto>(this.base + "users/block-high-rejection", { userIds }));
    }

    async getPayouts(status: number | null): Promise<AdminPayoutDto[]> {
        let params = new HttpParams();
        if (status !== null) params = params.set('status', status);
        return await firstValueFrom(this.http.get<AdminPayoutDto[]>(this.base + "payouts", { params }));
    }

    async processPayout(payoutId: number, statusId: number): Promise<{ isSuccess: boolean; message: string }> {
        const params = new HttpParams().set('statusId', statusId);
        return await firstValueFrom(this.http.post<any>(`${this.base}payouts/${payoutId}/process`, {}, { params }));
    }

    async getPriorityOffers(): Promise<PriorityOfferAdminDto[]> {
        return await firstValueFrom(this.http.get<PriorityOfferAdminDto[]>(this.base + "priority-offers"));
    }

    async savePriorityOffer(offer: PriorityOfferAdminDto): Promise<PriorityOfferAdminDto> {
        return await firstValueFrom(this.http.post<PriorityOfferAdminDto>(this.base + "priority-offers", offer));
    }

    // ───────────── Notifications (push + in-app list, website and app) ─────────────
    async getNotificationOverview(): Promise<NotificationAudienceDto> {
        return await firstValueFrom(this.http.get<NotificationAudienceDto>(this.config.baseUrl + "notification/admin/overview"));
    }

    async sendNotification(request: SendNotificationRequest): Promise<SendNotificationResult> {
        return await firstValueFrom(this.http.post<SendNotificationResult>(this.config.baseUrl + "notification/admin/send", request));
    }

    async deletePriorityOffer(id: number): Promise<{ isSuccess: boolean; message: string }> {
        return await firstValueFrom(this.http.delete<any>(`${this.base}priority-offers/${id}`));
    }
}
