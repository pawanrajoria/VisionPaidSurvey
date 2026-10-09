import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { Subscription } from 'rxjs';
import { SharedModule } from '../../../shared.module';
import { BaseComponent } from '../../../base.component';
import { NotificationService, PushPermission } from '../../../notification.service';

const DISMISS_KEY = 'notify_card_dismissed_at';
/** "Not now" hides the card for a week instead of nagging on every page load. */
const DISMISS_DAYS = 7;

/**
 * Sidebar card: "want the latest offers? turn on notifications".
 * Shown only while the browser can still be asked (permission "default"); once the visitor
 * allowed or blocked notifications there is nothing left for the card to do.
 */
@Component({
    selector: 'app-notify-card',
    imports: [SharedModule],
    template: `
    @if (visible) {
    <aside class="notify-card hide-menu" aria-label="Offer notifications">
        <button type="button" class="notify-close" (click)="dismiss()" aria-label="Not now">
            <mat-icon>close</mat-icon>
        </button>
        <button type="button" class="notify-art" [disabled]="busy || blocked" (click)="enable()" aria-label="Enable notifications">
            <img src="/assets/images/notify-offers.svg" alt="" width="240" height="140" loading="lazy" />
        </button>
        <strong>Want proper updates &amp; notifications?</strong>
        <p>Click below and allow notifications on this browser. We'll tell you the moment high-paying offers, bonuses and payouts arrive.</p>
        @if (blocked) {
        <p class="notify-note">Notifications are blocked for this site. Click the lock icon in your browser's address bar, allow Notifications, then reload the page.</p>
        } @else {
        <button type="button" class="notify-btn" [disabled]="busy" (click)="enable()">
            <mat-icon>notifications_active</mat-icon>{{ busy ? 'One moment…' : 'Enable notifications' }}
        </button>
        }
    </aside>
    }`,
    styles: [`
    .notify-card {
        position: relative;
        display: block;
        margin: 12px 14px 18px;
        padding: 12px;
        border: 1px solid #dfe7e4;
        border-radius: 16px;
        background: #f3f9f7;
        color: #14231f;
    }
    .notify-art {
        display: block;
        width: 100%;
        padding: 0;
        border: 0;
        border-radius: 12px;
        background: none;
        cursor: pointer;
        overflow: hidden;
        transition: transform .15s ease, box-shadow .15s ease;
    }
    .notify-art:hover:not(:disabled) { transform: translateY(-1px); box-shadow: 0 6px 16px rgba(16, 87, 73, .25); }
    .notify-art:disabled { cursor: default; }
    img {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 12px;
    }
    strong {
        display: block;
        margin: 10px 0 4px;
        font-size: 15px;
        line-height: 1.25;
    }
    p {
        margin: 0 0 10px;
        color: #5d6d68;
        font-size: 13px;
        line-height: 1.4;
    }
    .notify-note {
        margin: 0;
        color: #8a4b00;
    }
    .notify-btn {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 6px;
        width: 100%;
        min-height: 40px;
        border: 0;
        border-radius: 10px;
        background: #105749;
        color: #fff;
        font: inherit;
        font-size: 14px;
        font-weight: 600;
        cursor: pointer;
    }
    .notify-btn:hover { background: #0b3d33; }
    .notify-btn:disabled { opacity: .7; cursor: default; }
    .notify-btn mat-icon { width: 18px; height: 18px; font-size: 18px; }
    .notify-close {
        position: absolute;
        top: 18px;
        right: 18px;
        display: grid;
        place-items: center;
        width: 26px;
        height: 26px;
        border: 0;
        border-radius: 50%;
        background: rgba(0, 0, 0, .35);
        color: #fff;
        cursor: pointer;
    }
    .notify-close mat-icon { width: 16px; height: 16px; font-size: 16px; }
    `]
})
export class NotifyCardComponent extends BaseComponent implements OnInit, OnDestroy {
    private readonly notifications = inject(NotificationService);
    private subscription = Subscription.EMPTY;

    permission: PushPermission = 'unsupported';
    dismissed = false;
    busy = false;
    /** The visitor pressed "Enable" here and the browser (or they) said no. */
    blocked = false;

    get visible(): boolean {
        // "denied" too: a visitor who blocked notifications earlier sees how to switch them back on.
        return !this.dismissed && (this.permission === 'default' || this.permission === 'denied' || this.blocked);
    }

    ngOnInit() {
        if (!this.isBrowser) return;
        this.dismissed = this.recentlyDismissed();
        this.subscription = this.notifications.permission$.subscribe(p => {
            this.permission = p;
            this.blocked = p === 'denied';
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    async enable() {
        if (this.busy) return;
        this.busy = true;
        const result = await this.notifications.enable();
        this.busy = false;
        this.blocked = result === 'denied';
    }

    dismiss() {
        this.dismissed = true;
        try { localStorage.setItem(DISMISS_KEY, String(Date.now())); } catch { /* storage blocked */ }
    }

    private recentlyDismissed(): boolean {
        try {
            const at = Number(localStorage.getItem(DISMISS_KEY) ?? 0);
            return at > 0 && Date.now() - at < DISMISS_DAYS * 24 * 60 * 60 * 1000;
        } catch {
            return false;
        }
    }
}
