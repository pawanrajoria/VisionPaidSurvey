import {
    AfterViewInit,
    Component,
    ViewChild,
    OnDestroy,
    NgZone,
    Inject,
    PLATFORM_ID,
    ChangeDetectorRef
} from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { Router, NavigationEnd } from '@angular/router';
import { BreakpointObserver } from '@angular/cdk/layout';
import { Subscription, filter } from 'rxjs';

import { SharedModule } from '../../shared.module';
import { SidebarComponent } from './sidebar/sidebar.component';
import { HeaderComponent } from './header/header.component';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { AppNavItemComponent } from './sidebar/nav-item/nav-item.component';
import { CoreService } from './core.service';
import { AccountService } from '../home/account.service';
import { NavItem } from './sidebar/nav-item/nav-item';
import { BaseComponent } from '../../base.component';
import { NotificationService } from '../../notification.service';
import { MessageService } from './message/message.service';
import { MessageVM } from './message/message.vm';
import { LivepayoutComponent } from './live-payout/live-payout.component';
import { GtmService } from '../../gtm.service';
import { EngagementService } from '../home/engagement/engagement.service';
import { USER_TIME_ZONE_KEY } from '../../timezones';
import { NotifyCardComponent } from './notify-card/notify-card.component';

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';

@Component({
    selector: 'app-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    imports: [
        SharedModule,
        SidebarComponent,
        HeaderComponent,
        LivepayoutComponent,
        AppNavItemComponent,
        NgScrollbarModule,
        NotifyCardComponent
    ]
})
export class LayoutComponent extends BaseComponent implements AfterViewInit, OnDestroy {
    @ViewChild('leftsidenav') public sidenav!: MatSidenav;
    @ViewChild('content', { static: true }) content!: MatSidenavContent;

    options: ReturnType<CoreService['getOptions']>;
    allowedMenus: NavItem[] = []; // Initialize as empty array for SSR safety

    private layoutChangesSubscription = Subscription.EMPTY;
    private messageSubscription = Subscription.EMPTY;
    private isMobileScreen = false;
    private isContentWidthFixed = true;
    private isCollapsedWidthFixed = false;
    activeNotification: { title: string, body: string } | null = null;
    notificationHistory: any[] = [];
    private swMessageHandler = (event: MessageEvent) => {
        if (event.data?.type === 'notification-click') this.ngZone.run(() => this.openNotificationUrl(event.data.url));
    };

    get isOver(): boolean {
        return this.isMobileScreen;
    }

    constructor(
        private settings: CoreService,
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private accountService: AccountService,
        private notificationService: NotificationService,
        private messageService: MessageService,
        private ngZone: NgZone,
        private gtm: GtmService,
        private engagementService: EngagementService,
        private cdr: ChangeDetectorRef, // To manually trigger detection after async data load
        @Inject(PLATFORM_ID) private platformId: Object
    ) {
        super();
        this.options = this.settings.getOptions();

        // 1. Observe layout changes (BreakpointObserver is SSR-safe)
        this.layoutChangesSubscription = this.breakpointObserver
            .observe([MOBILE_VIEW, TABLET_VIEW])
            .subscribe((state) => {
                this.options.sidenavOpened = true;
                this.isMobileScreen = state.breakpoints[MOBILE_VIEW];

                if (!this.options.sidenavCollapsed) {
                    this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
                }

                // ✅ FIX: Use markForCheck instead of detectChanges
                // This schedules a check instead of forcing one immediately
                if (isPlatformBrowser(this.platformId)) {
                    this.cdr.markForCheck();
                }
            });

        // 2. Scroll to top logic (Strictly Browser Only)
        if (isPlatformBrowser(this.platformId)) {
            this.router.events
                .pipe(filter((event) => event instanceof NavigationEnd))
                .subscribe((event) => {
                    this.content?.scrollTo({ top: 0 });
                    this.gtm.pushEvent('generate_lead', {
                        page_location: this.gtm.location,
                        page_title: this.gtm.title,
                        page_path: event.urlAfterRedirects
                    });
                });
        }
    }

    async ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.initBrowserFlow();
        } else {
            this.allowedMenus = this.accountService.getAllowedMenus();
        }

    }

    private initBrowserFlow() {
        // Use setTimeout to move execution out of the current change detection cycle
        setTimeout(async () => {
            // ✅ FIX 1: Populate menus and profile (This fixes the "Loading..." issue)
            this.allowedMenus = this.accountService.getAllowedMenus();
            await this.getUserProfile();
            this.syncTimeZone();

            // ✅ FIX 2: Register notifications
            const userEmail = this.accountService.userEmail || '';
            this.notificationService.registerNotificationToken(userEmail);
            this.notificationService.listenForMessages();
            this.loadNotifications();
            // A notification tapped while the site is open asks this tab to navigate.
            navigator.serviceWorker?.addEventListener('message', this.swMessageHandler);

            // ✅ FIX 3: Safe subscription handling
            this.messageSubscription = this.notificationService.currentMessage.subscribe((msg) => {
                if (msg) {
                    this.ngZone.run(() => {
                        // FCM payloads are usually nested in 'notification'
                        const title = msg.notification?.title || msg.title || 'Notification';
                        const body = msg.notification?.body || msg.body || '';

                        this.activeNotification = { title, body };
                        // Newest first; an announcement that is already listed is not added twice.
                        const id = Number(msg.data?.notificationId ?? 0);
                        if (!id || !this.notificationHistory.some(n => n.id === id)) {
                            this.notificationHistory = [
                                { id: id || Date.now(), title, body, url: msg.data?.url || null },
                                ...this.notificationHistory
                            ];
                        }

                        // Show the message service (toast)
                        this.messageService.showMessage(new MessageVM(body, title));

                        // Use markForCheck() here to avoid ASSERTION ERROR
                        this.cdr.markForCheck();

                        // Auto-hide banner
                        setTimeout(() => {
                            this.activeNotification = null;
                            this.cdr.markForCheck();
                        }, 5000);
                    });
                }
            });

            // Trigger one final check after all async data (menus/profile) is ready
            this.cdr.detectChanges();
        }, 0);
    }


    /** Keeps this device in step with the time zone saved on the account (applies on next load). */
    private async syncTimeZone() {
        const settings = await this.engagementService.getSettings();
        if (!settings) return;
        try {
            if (settings.timeZone) localStorage.setItem(USER_TIME_ZONE_KEY, settings.timeZone);
            else localStorage.removeItem(USER_TIME_ZONE_KEY);
        } catch { /* storage blocked */ }
    }

    async getUserProfile() {
        const response = await this.accountService.getuserinfo();
        if (!!response) {
            this.accountService.setUserBalanceInfo(response);
        }
    }

    /** Announcements sent from the admin console that this user has not cleared yet. */
    private async loadNotifications() {
        const seenId = this.notificationService.seenId;
        const list = (await this.notificationService.getNotifications()).filter(n => n.id > seenId);
        if (list.length) {
            const known = new Set(this.notificationHistory.map(n => n.id));
            this.notificationHistory = [...this.notificationHistory, ...list.filter(n => !known.has(n.id))];
            this.cdr.markForCheck();
        }
    }

    /** "/app/offers" (a page of the site, language added here) or a full https link. */
    openNotificationUrl(url?: string | null) {
        if (!url) return;
        if (url.startsWith('/')) {
            this.router.navigateByUrl(`/${this.currentLocale}${url}`);
        } else if (/^https:\/\//i.test(url)) {
            window.open(url, '_blank', 'noopener');
        }
    }

    ngOnDestroy() {
        this.layoutChangesSubscription.unsubscribe();
        this.messageSubscription.unsubscribe();
        if (isPlatformBrowser(this.platformId)) {
            navigator.serviceWorker?.removeEventListener('message', this.swMessageHandler);
        }
    }

    // --- SideNav UI Methods ---

    toggleCollapsed() {
        this.isContentWidthFixed = false;
        this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
        this.resetCollapsedState();
    }

    resetCollapsedState(timer = 400) {
        if (isPlatformBrowser(this.platformId)) {
            setTimeout(() => this.settings.setOptions(this.options), timer);
        }
    }

    onSidenavClosedStart() {
        this.isContentWidthFixed = false;
    }

    onSidenavOpenedChange(isOpened: boolean) {
        this.isCollapsedWidthFixed = !this.isOver;
        this.options.sidenavOpened = isOpened;
    }

    clearNotifications() {
        // Remembered per browser, so cleared announcements do not come back on the next visit.
        const newest = Math.max(0, ...this.notificationHistory.map(n => Number(n.id) || 0).filter(id => id < 1e12));
        this.notificationService.markSeen(newest);
        this.notificationHistory = [];
    }
}