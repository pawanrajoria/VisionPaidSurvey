import { Component, inject, OnDestroy, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { BaseComponent } from "../../../base.component";
import { EngagementService } from "../../home/engagement/engagement.service";
import { ILiveFeed, ILiveFeedItem } from "../../home/engagement/engagement.vm";

/**
 * "Live payouts": real recent earnings and cash-outs from members (names masked by the API),
 * with today's totals. Refreshes while the page is visible; a new entry pops up as a short toast
 * above the button when the panel is closed.
 */
@Component({
    selector: 'app-live-payout',
    imports: [SharedModule],
    templateUrl: './live-payout.component.html',
    styleUrls: ['./live-payout.component.scss']
})
export class LivepayoutComponent extends BaseComponent implements OnInit, OnDestroy {
    private readonly engagement = inject(EngagementService);

    private static readonly OPEN_REFRESH_MS = 20000;
    private static readonly CLOSED_REFRESH_MS = 60000;

    isExpanded = false;
    loaded = false;
    feed: ILiveFeed | null = null;
    /** Entries that arrived on the last refresh; they slide in highlighted. */
    fresh = new Set<string>();
    toast: ILiveFeedItem | null = null;
    now = Date.now();

    private timer: ReturnType<typeof setTimeout> | null = null;
    private toastTimer: ReturnType<typeof setTimeout> | null = null;

    ngOnInit() {
        if (!this.isBrowser) return;
        this.refresh();
    }

    toggleTicker() {
        this.isExpanded = !this.isExpanded;
        this.toast = null;
        if (this.isExpanded) this.refresh();
    }

    key(item: ILiveFeedItem): string {
        return `${item.kind}|${item.name}|${item.atUtc}|${item.points}`;
    }

    private async refresh() {
        if (this.timer) clearTimeout(this.timer);
        const hidden = this.doc?.visibilityState === 'hidden';
        if (!hidden || !this.loaded) {
            const next = await this.engagement.getLiveFeed();
            if (next) this.apply(next);
            this.loaded = true;
        }
        this.now = Date.now();
        this.timer = setTimeout(() => this.refresh(),
            this.isExpanded ? LivepayoutComponent.OPEN_REFRESH_MS : LivepayoutComponent.CLOSED_REFRESH_MS);
    }

    private apply(next: ILiveFeed) {
        const known = new Set((this.feed?.items ?? []).map(i => this.key(i)));
        const arrived = this.feed ? next.items.filter(i => !known.has(this.key(i))) : [];
        this.fresh = new Set(arrived.map(i => this.key(i)));
        this.feed = next;

        const newest = arrived.find(i => !i.isMe);
        if (newest && !this.isExpanded) this.showToast(newest);
    }

    private showToast(item: ILiveFeedItem) {
        this.toast = item;
        if (this.toastTimer) clearTimeout(this.toastTimer);
        this.toastTimer = setTimeout(() => this.toast = null, 5000);
    }

    ago(item: ILiveFeedItem): string {
        const seconds = Math.max(0, Math.round((this.now - new Date(item.atUtc).getTime()) / 1000));
        if (seconds < 60) return 'just now';
        const minutes = Math.round(seconds / 60);
        if (minutes < 60) return `${minutes} min ago`;
        const hours = Math.round(minutes / 60);
        if (hours < 24) return `${hours} h ago`;
        const days = Math.round(hours / 24);
        return days === 1 ? 'yesterday' : `${days} days ago`;
    }

    /** "IN" -> 🇮🇳 */
    flag(code: string): string {
        if (!code || code.length !== 2) return '';
        return String.fromCodePoint(...code.toUpperCase().split('').map(c => 0x1F1A5 + c.charCodeAt(0)));
    }

    ngOnDestroy() {
        if (this.timer) clearTimeout(this.timer);
        if (this.toastTimer) clearTimeout(this.toastTimer);
    }
}
