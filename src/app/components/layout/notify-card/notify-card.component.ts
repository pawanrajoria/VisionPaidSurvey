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
        <!-- The whole picture is the button: one click asks the browser for permission. -->
        <button type="button" class="notify-image" [disabled]="busy || blocked" (click)="enable()"
            aria-label="Enable notifications for updates and new offers">
            <img src="/assets/images/notify-enable.svg" alt="" width="240" height="178" loading="lazy" />
        </button>
        <strong>Get proper updates &amp; notifications</strong>
        <p>Click the picture or the button to enable notifications in this browser - we'll tell you the moment new offers, bonuses and payouts happen.</p>
        @if (blocked) {
        <p class="notify-note">Notifications are blocked for this site. Allow them from the lock icon in your browser's address bar.</p>
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
    .notify-image {
        display: block;
        width: 100%;
        padding: 0;
        border: 0;
        border-radius: 12px;
        background: none;
        cursor: pointer;
        transition: transform .15s ease, box-shadow .15s ease;
    }
    .notify-image:hover:not(:disabled) {
        transform: translateY(-2px);
        box-shadow: 0 8px 18px rgba(11, 61, 51, .25);
    }
    .notify-image:disabled { cursor: default; }
    .notify-image:focus-visible { outline: 2px solid #105749; outline-offset: 2px; }
    img {
        display: block;
        width: 100%;
        height: auto;
        border-radius: 12px;
        animation: notify-ring 3.5s ease-in-out 1s infinite;
    }
    @keyframes notify-ring {
        0%, 88%, 100% { transform: none; }
        91% { transform: rotate(-1.5deg); }
        94% { transform: rotate(1.5deg); }
        97% { transform: rotate(-1deg); }
    }
    @media (prefers-reduced-motion: reduce) { img { animation: none; } }
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
        return !this.dismissed && (this.permission === 'default' || this.blocked);
    }

    ngOnInit() {
        if (!this.isBrowser) return;
        this.dismissed = this.recentlyDismissed();
        this.subscription = this.notifications.permission$.subscribe(p => this.permission = p);
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
