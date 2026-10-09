import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../shared.module";
import { BaseComponent } from "../../base.component";
import { AdminService } from "./admin.service";
import { AdminDashboardComponent } from "./dashboard/dashboard.component";
import { MessageService } from "../layout/message/message.service";
import { MessageVM } from "../layout/message/message.vm";
import { AdminActivityPeriodDto, AdminBonusReportDto, AdminEarningsSummaryDto, AdminEarningItemDto, AdminOverviewDto, AdminPayoutDto, AdminUserDetailDto, AdminUserDto, NotificationAudienceDto, PriorityOfferAdminDto, SendNotificationRequest } from "./admin.vm";
import { ChatService, IAdminChatMessage } from "../home/chat/chat.service";

type AdminTab = 'overview' | 'offers' | 'payouts' | 'users' | 'chat' | 'notifications' | 'earnings';

const PAYOUT_PENDING = 1, PAYOUT_COMPLETED = 2, PAYOUT_REJECTED = 4;
const USER_BLOCKED = 3;

@Component({
    selector: 'app-admin',
    imports: [SharedModule, AdminDashboardComponent],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent extends BaseComponent implements OnInit {
    readonly tabs: { id: AdminTab; label: string; icon: string }[] = [
        { id: 'overview', label: 'Overview', icon: 'insights' },
        { id: 'offers', label: 'Priority offers', icon: 'local_offer' },
        { id: 'payouts', label: 'Payouts', icon: 'payments' },
        { id: 'users', label: 'Users', icon: 'group' },
        { id: 'chat', label: 'Chat', icon: 'forum' },
        { id: 'notifications', label: 'Notifications', icon: 'campaign' },
        { id: 'earnings', label: 'Earnings', icon: 'monitoring' }
    ];
    tab: AdminTab = 'overview';
    busy = false;

    // Overview
    overview: AdminOverviewDto | null = null;
    activity: AdminActivityPeriodDto[] = [];
    readonly activityLabels: Record<string, string> = { today: 'Today', week: 'Last 7 days', month: 'Last 30 days' };
    overviewError = '';

    // Priority offers
    offers: PriorityOfferAdminDto[] = [];
    offersLoaded = false;
    editing: PriorityOfferAdminDto | null = null;
    formError = '';
    readonly devices = ['All', 'Desktop', 'Android', 'IOS'];
    readonly tagSuggestions = ['Priority', 'Hot', 'New', 'High paying', 'Limited time'];

    // Payouts
    payouts: AdminPayoutDto[] = [];
    payoutFilter: number | null = PAYOUT_PENDING;
    payoutsLoaded = false;

    // Users
    users: AdminUserDto[] = [];
    userTotal = 0;
    userSearch = '';
    userStatus: number | null = null;
    userPage = 1;
    readonly userPageSize = 25;
    usersLoaded = false;

    // Chat moderation
    chatMessages: IAdminChatMessage[] = [];
    chatLoaded = false;
    chatHasMore = false;

    // Notifications
    notifications: NotificationAudienceDto | null = null;
    notificationError = '';
    notificationForm: SendNotificationRequest = { title: '', body: '', url: '', audience: 'all' };
    notificationFormError = '';
    readonly audiences = [
        { value: 'all', label: 'Everyone (website + apps)' },
        { value: 'web', label: 'Website only' },
        { value: 'android', label: 'Android app only' },
        { value: 'ios', label: 'iOS app only' }
    ];

    constructor(private adminService: AdminService, private messageService: MessageService, private chatService: ChatService) {
        super();
    }

    async ngOnInit() {
        await this.loadOverview();
    }

    async selectTab(tab: AdminTab) {
        this.tab = tab;
        if (tab === 'overview' && !this.overview) await this.loadOverview();
        if (tab === 'offers' && !this.offersLoaded) await this.loadOffers();
        if (tab === 'payouts' && !this.payoutsLoaded) await this.loadPayouts();
        if (tab === 'users' && !this.usersLoaded) await this.loadUsers();
        if (tab === 'chat') await this.loadChat();
        if (tab === 'notifications') await this.loadNotifications();
        if (tab === 'earnings' && !this.bonusReport) await this.loadBonusReport();
    }

    // ───────────── User detail drawer ─────────────
    detail: AdminUserDetailDto | null = null;
    detailLoading = false;
    detailFilter: 'all' | 'earning' | 'rejection' | 'bonus' = 'all';

    async openUser(userId: number) {
        this.detailLoading = true;
        this.detailFilter = 'all';
        this.detail = null;
        try {
            this.detail = await this.adminService.getUserDetail(userId);
        } catch { /* the interceptor already showed the reason */ } finally {
            this.detailLoading = false;
        }
    }

    closeUser() {
        this.detail = null;
        this.detailLoading = false;
    }

    get detailHistory(): AdminEarningItemDto[] {
        const rows = this.detail?.history ?? [];
        return this.detailFilter === 'all' ? rows : rows.filter(r => r.kind === this.detailFilter);
    }

    /** "1 year 2 months", "3 months", "12 days" */
    accountAge(days: number): string {
        if (days < 31) return `${days} day${days === 1 ? '' : 's'}`;
        const years = Math.floor(days / 365), months = Math.floor((days % 365) / 30);
        const parts = [];
        if (years) parts.push(`${years} year${years === 1 ? '' : 's'}`);
        if (months) parts.push(`${months} month${months === 1 ? '' : 's'}`);
        return parts.join(' ') || `${days} days`;
    }

    // ───────────── Bonus report (Earnings tab) ─────────────
    bonusReport: AdminBonusReportDto | null = null;
    earningsSummary: AdminEarningsSummaryDto | null = null;
    bonusPeriod = 'week';
    bonusType = '';
    readonly bonusPeriods = [
        { value: 'day', label: 'Today' },
        { value: 'week', label: '7 days' },
        { value: 'month', label: '30 days' },
        { value: 'year', label: '12 months' }
    ];

    async loadBonusReport(period = this.bonusPeriod) {
        this.bonusPeriod = period;
        this.adminService.getEarningsSummary(period)
            .then(s => this.earningsSummary = s)
            .catch(() => { /* the interceptor already showed the reason */ });
        try {
            this.bonusReport = await this.adminService.getBonusReport(period);
            if (this.bonusType && !this.bonusReport.byType.some(t => t.typeName === this.bonusType)) this.bonusType = '';
        } catch { /* the interceptor already showed the reason */ }
    }

    get bonusItems(): AdminEarningItemDto[] {
        const items = this.bonusReport?.items ?? [];
        return this.bonusType ? items.filter(i => i.typeName === this.bonusType) : items;
    }

    private toast(message: string, type: 'success' | 'error' = 'success') {
        this.messageService.showMessage(new MessageVM(message, type));
    }

    // ───────────── Overview ─────────────
    async loadOverview() {
        this.overviewError = '';
        this.adminService.getActivity().then(a => this.activity = a ?? []).catch(() => this.activity = []);
        try {
            this.overview = await this.adminService.getOverview();
        } catch {
            this.overviewError = 'The overview could not be loaded.';
        }
    }

    /** Share of the period's active users, for the bars in the activity grid. */
    percentOf(part: number, a: AdminActivityPeriodDto): number {
        return a.active > 0 ? Math.round(part * 100 / a.active) : 0;
    }

    get maxSignups(): number {
        return Math.max(1, ...(this.overview?.signups ?? []).map(s => s.count));
    }

    get profileCompletionRate(): number {
        const o = this.overview;
        return o && o.activeUsers > 0 ? Math.round((o.onboardingCompleted / o.activeUsers) * 100) : 0;
    }

    // ───────────── Priority offers ─────────────
    async loadOffers() {
        try {
            this.offers = await this.adminService.getPriorityOffers();
            this.offersLoaded = true;
        } catch { /* the interceptor already showed the reason */ }
    }

    newOffer() {
        this.formError = '';
        this.editing = {
            id: 0, title: '', description: '', imageUrl: '', clickUrl: '', points: 0, tag: 'Priority',
            countryCode: '*', device: 'All', sortOrder: 0, isActive: true, showAsPopup: false, startDate: null, endDate: null
        };
    }

    editOffer(offer: PriorityOfferAdminDto) {
        this.formError = '';
        this.editing = {
            ...offer,
            startDate: this.toLocalInput(offer.startDate),
            endDate: this.toLocalInput(offer.endDate)
        };
    }

    cancelEdit() {
        this.editing = null;
        this.formError = '';
    }

    /** ISO string -> value for <input type="datetime-local"> in the admin's own time zone. */
    private toLocalInput(value: string | null | undefined): string | null {
        if (!value) return null;
        const d = new Date(value);
        if (isNaN(d.getTime())) return null;
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
    }

    private toIso(value: string | null | undefined): string | null {
        if (!value) return null;
        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d.toISOString();
    }

    async saveOffer() {
        const offer = this.editing;
        if (!offer || this.busy) return;

        this.formError = '';
        if (!offer.title.trim()) { this.formError = 'Title is required.'; return; }
        if (!offer.clickUrl.trim()) { this.formError = 'Click URL is required.'; return; }
        const country = (offer.countryCode ?? '*').trim().toUpperCase() || '*';
        if (country !== '*' && !/^[A-Z]{2}$/.test(country)) {
            this.formError = 'Country must be a 2-letter code such as US or IN, or * for all countries.';
            return;
        }

        this.busy = true;
        try {
            await this.adminService.savePriorityOffer({
                ...offer,
                title: offer.title.trim(),
                clickUrl: offer.clickUrl.trim(),
                countryCode: country,
                points: Number(offer.points) || 0,
                sortOrder: Number(offer.sortOrder) || 0,
                startDate: this.toIso(offer.startDate),
                endDate: this.toIso(offer.endDate)
            });
            this.editing = null;
            this.toast('Priority offer saved.');
            await this.loadOffers();
        } catch (e: any) {
            this.formError = e?.error?.message || 'The offer could not be saved.';
        } finally {
            this.busy = false;
        }
    }

    async toggleOffer(offer: PriorityOfferAdminDto) {
        if (this.busy) return;
        this.busy = true;
        try {
            await this.adminService.savePriorityOffer({ ...offer, isActive: !offer.isActive });
            await this.loadOffers();
        } catch { /* toast already shown */ } finally {
            this.busy = false;
        }
    }

    async deleteOffer(offer: PriorityOfferAdminDto) {
        if (this.busy || !this.win?.confirm(`Delete "${offer.title}"? This cannot be undone.`)) return;
        this.busy = true;
        try {
            await this.adminService.deletePriorityOffer(offer.id);
            this.toast('Priority offer deleted.');
            await this.loadOffers();
        } catch { /* toast already shown */ } finally {
            this.busy = false;
        }
    }

    offerState(offer: PriorityOfferAdminDto): string {
        if (!offer.isActive) return 'Off';
        const now = Date.now();
        if (offer.startDate && new Date(offer.startDate).getTime() > now) return 'Scheduled';
        if (offer.endDate && new Date(offer.endDate).getTime() < now) return 'Expired';
        return 'Live';
    }

    // ───────────── Payouts ─────────────
    async loadPayouts() {
        try {
            this.payouts = await this.adminService.getPayouts(this.payoutFilter);
            this.payoutsLoaded = true;
        } catch { /* toast already shown */ }
    }

    async setPayoutFilter(status: number | null) {
        this.payoutFilter = status;
        await this.loadPayouts();
    }

    isPending(p: AdminPayoutDto): boolean { return p.status === PAYOUT_PENDING; }

    async processPayout(p: AdminPayoutDto, approve: boolean) {
        if (this.busy) return;
        const verb = approve ? 'Approve' : 'Reject';
        if (!this.win?.confirm(`${verb} the $${p.amount} ${p.method} payout for ${p.email}?`)) return;

        this.busy = true;
        try {
            const result = await this.adminService.processPayout(p.payoutId, approve ? PAYOUT_COMPLETED : PAYOUT_REJECTED);
            this.toast(result?.message || 'Done.', result?.isSuccess ? 'success' : 'error');
            await this.loadPayouts();
            this.overview = null;
        } catch { /* toast already shown */ } finally {
            this.busy = false;
        }
    }

    // ───────────── Users ─────────────
    /** null = everyone, otherwise only users at or above this rejection %. */
    minRejection: number | null = null;
    highlightPercent = 30;
    blockPercent = 90;
    selectedUserIds = new Set<number>();
    bulkSkipped: string[] = [];

    async loadUsers() {
        try {
            const result = await this.adminService.getUsers(this.userSearch, this.userStatus, this.minRejection, this.userPage, this.userPageSize);
            this.users = result.users;
            this.userTotal = result.total;
            this.highlightPercent = result.highlightRejectionPercent || 30;
            this.blockPercent = result.blockRejectionPercent || 90;
            this.usersLoaded = true;
            // Keep only selections that are still on screen.
            const visible = new Set(this.users.map(u => u.id));
            this.selectedUserIds.forEach(id => { if (!visible.has(id)) this.selectedUserIds.delete(id); });
        } catch { /* toast already shown */ }
    }

    /** 'block' = at/above the disable threshold, 'warn' = above the highlight threshold. */
    rejectionLevel(u: AdminUserDto): 'block' | 'warn' | '' {
        if (u.rejectionRate >= this.blockPercent) return 'block';
        if (u.rejectionRate > this.highlightPercent) return 'warn';
        return '';
    }

    /** Only active accounts at or above the disable threshold can be picked for the bulk action. */
    canSelect(u: AdminUserDto): boolean {
        return u.status === 1 && u.rejectionRate >= this.blockPercent;
    }

    get selectableUsers(): AdminUserDto[] { return this.users.filter(u => this.canSelect(u)); }

    get allSelected(): boolean {
        const selectable = this.selectableUsers;
        return selectable.length > 0 && selectable.every(u => this.selectedUserIds.has(u.id));
    }

    toggleUser(u: AdminUserDto) {
        if (!this.canSelect(u)) return;
        if (this.selectedUserIds.has(u.id)) this.selectedUserIds.delete(u.id);
        else this.selectedUserIds.add(u.id);
    }

    toggleAllUsers() {
        if (this.allSelected) this.selectedUserIds.clear();
        else this.selectableUsers.forEach(u => this.selectedUserIds.add(u.id));
    }

    /** "web,android" -> "Web + App"; the icon shows where the user was seen last. */
    platformLabel(u: AdminUserDto): string {
        const names: Record<string, string> = { web: 'Web', android: 'Android app', ios: 'iOS app' };
        const all = (u.platforms || u.lastPlatform || '').split(',').map(p => p.trim()).filter(p => !!p);
        return all.length ? all.map(p => names[p] ?? p).join(' + ') : '—';
    }

    platformIcon(platform: string): string {
        return platform === 'android' ? 'android' : platform === 'ios' ? 'phone_iphone' : platform === 'web' ? 'language' : 'help_outline';
    }

    // ───────────── Notifications ─────────────
    async loadNotifications() {
        this.notificationError = '';
        try {
            this.notifications = await this.adminService.getNotificationOverview();
        } catch {
            this.notificationError = 'Notifications could not be loaded.';
        }
    }

    /** Devices that will get the push for the audience picked in the form. */
    get notificationReach(): number {
        const n = this.notifications;
        if (!n) return 0;
        switch (this.notificationForm.audience) {
            case 'web': return n.webDevices;
            case 'android': return n.androidDevices;
            case 'ios': return n.iosDevices;
            default: return n.webDevices + n.androidDevices + n.iosDevices;
        }
    }

    audienceLabel(value: string): string {
        return value === 'web' ? 'Website' : value === 'android' ? 'Android' : value === 'ios' ? 'iOS' : 'Everyone';
    }

    async sendNotification() {
        const f = this.notificationForm;
        const title = f.title.trim(), body = f.body.trim(), url = f.url.trim();
        this.notificationFormError =
            title.length < 3 ? 'Add a title (at least 3 characters).'
                : body.length < 3 ? 'Add the message.'
                    : url && !url.startsWith('/') && !/^https:\/\//i.test(url) ? 'The link must start with / (a page of the site, e.g. /app/offers) or https://.'
                        : '';
        if (this.notificationFormError || this.busy) return;

        const who = this.audiences.find(a => a.value === f.audience)?.label ?? 'Everyone';
        if (!confirm(`Send this notification to: ${who}?\n\n${title}\n${body}`)) return;

        this.busy = true;
        try {
            const result = await this.adminService.sendNotification({ title, body, url, audience: f.audience });
            this.toast(result?.message ?? 'Done', result?.isSuccess ? 'success' : 'error');
            if (result?.isSuccess) {
                this.notificationForm = { title: '', body: '', url: '', audience: f.audience };
                await this.loadNotifications();
            } else {
                this.notificationFormError = result?.message ?? '';
            }
        } catch { /* toast already shown */ } finally {
            this.busy = false;
        }
    }

    // ───────────── Chat moderation ─────────────
    async loadChat(older = false) {
        try {
            const beforeId = older && this.chatMessages.length ? this.chatMessages[this.chatMessages.length - 1].id : 0;
            const rows = await this.chatService.adminMessages(beforeId, 100);
            this.chatMessages = older ? [...this.chatMessages, ...rows] : rows;
            this.chatHasMore = rows.length >= 100;
        } catch {
            if (!older) this.chatMessages = [];
        }
        this.chatLoaded = true;
    }

    async removeChat(m: IAdminChatMessage) {
        if (this.busy) return;
        this.busy = true;
        try {
            const result = m.isDeleted ? await this.chatService.restore(m.id) : await this.chatService.remove(m.id);
            if (result?.isSuccess) m.isDeleted = !m.isDeleted;
            this.toast(result?.message ?? 'Done', result?.isSuccess ? 'success' : 'error');
        } catch { /* the interceptor already told the admin */ } finally { this.busy = false; }
    }

    /** Mute stops the user posting (they can still read). Muting also removes everything they posted. */
    async muteChat(m: IAdminChatMessage) {
        if (this.busy) return;
        const mute = !m.isMuted;
        if (mute && this.isBrowser && !confirm(`Mute ${m.fullName || m.email} and remove all their chat messages?`)) return;
        this.busy = true;
        try {
            const result = await this.chatService.mute(m.userId, mute, mute);
            this.toast(result?.message ?? 'Done', result?.isSuccess ? 'success' : 'error');
            if (result?.isSuccess) await this.loadChat();
        } catch { /* the interceptor already told the admin */ } finally { this.busy = false; }
    }

    providerName(provider: string): string {
        return ({ 'password': 'Email', 'google.com': 'Google', 'apple.com': 'Apple', 'facebook.com': 'Facebook' } as Record<string, string>)[provider] ?? (provider || '—');
    }

    async disableSelected() {
        const ids = Array.from(this.selectedUserIds);
        if (this.busy || ids.length === 0) return;
        if (!this.win?.confirm(`Disable ${ids.length} account${ids.length === 1 ? '' : 's'} and email each user that a high rejection rate was found?`)) return;

        this.busy = true;
        this.bulkSkipped = [];
        try {
            const result = await this.adminService.blockHighRejectionUsers(ids);
            this.toast(result?.message || 'Done.', result?.isSuccess ? 'success' : 'error');
            this.bulkSkipped = result?.skipped ?? [];
            this.selectedUserIds.clear();
            await this.loadUsers();
            this.overview = null;
        } catch { /* toast already shown */ } finally {
            this.busy = false;
        }
    }

    async searchUsers() {
        this.userPage = 1;
        await this.loadUsers();
    }

    get userPageCount(): number { return Math.max(1, Math.ceil(this.userTotal / this.userPageSize)); }

    async goToUserPage(page: number) {
        if (page < 1 || page > this.userPageCount) return;
        this.userPage = page;
        await this.loadUsers();
    }

    isBlocked(u: AdminUserDto): boolean { return u.status === USER_BLOCKED; }

    async toggleBlock(u: AdminUserDto) {
        if (this.busy) return;
        const block = !this.isBlocked(u);
        if (!this.win?.confirm(`${block ? 'Block' : 'Unblock'} ${u.email}?`)) return;

        this.busy = true;
        try {
            const result = await this.adminService.setUserBlocked(u.id, block);
            this.toast(result?.message || 'Done.', result?.isSuccess ? 'success' : 'error');
            await this.loadUsers();
        } catch { /* toast already shown */ } finally {
            this.busy = false;
        }
    }
}
