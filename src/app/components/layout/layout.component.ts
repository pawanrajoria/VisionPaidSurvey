import {
    AfterViewInit,
    Component,
    ViewChild,
    OnDestroy
} from '@angular/core';
import { MatSidenav, MatSidenavContent } from '@angular/material/sidenav';
import { Router, NavigationEnd, RouterModule } from '@angular/router';
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
import { BaseComponent } from '../../base.component'; // Adjust path as needed

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';

@Component({
    selector: 'app-layout',
    standalone: true,
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    imports: [
        RouterModule,
        SharedModule,
        SidebarComponent,
        HeaderComponent,
        AppNavItemComponent,
        NgScrollbarModule
    ]
})
export class LayoutComponent extends BaseComponent implements AfterViewInit, OnDestroy {
    @ViewChild('leftsidenav') public sidenav!: MatSidenav;
    @ViewChild('content', { static: true }) content!: MatSidenavContent;

    resView = false;
    options: ReturnType<CoreService['getOptions']>;
    allowedMenus: NavItem[] = [];

    private layoutChangesSubscription = Subscription.EMPTY;
    private isMobileScreen = false;
    private isContentWidthFixed = true;
    private isCollapsedWidthFixed = false;

    get isOver(): boolean {
        return this.isMobileScreen;
    }

    constructor(
        private settings: CoreService,
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private accountService: AccountService
    ) {
        super(); // initializes isBrowser, doc, win, nav
        this.options = this.settings.getOptions();

        // SSR-safe DOM access
        const htmlElement = this.doc?.querySelector('html');
        if (htmlElement) {
            // Do something if needed
        }

        // Observe layout changes
        this.layoutChangesSubscription = this.breakpointObserver
            .observe([MOBILE_VIEW, TABLET_VIEW])
            .subscribe((state) => {
                this.options.sidenavOpened = true;
                this.isMobileScreen = state.breakpoints[MOBILE_VIEW];

                if (!this.options.sidenavCollapsed) {
                    this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
                }
            });

        // Scroll to top on route change (SSR-safe)
        if (this.isBrowser) {
            this.router.events
                .pipe(filter((event) => event instanceof NavigationEnd))
                .subscribe(() => {
                    this.content?.scrollTo({ top: 0 });
                });
        }
    }

    async ngAfterViewInit() {
        this.allowedMenus = this.accountService.getAllowedMenus();
        await this.getUserProfile();
    }

    async getUserProfile() {
        const response = await this.accountService.getuserinfo();
        if (!!response) {
            this.accountService.setUserBalanceInfo(response);
        }
    }

    ngOnDestroy() {
        this.layoutChangesSubscription.unsubscribe();
    }

    toggleCollapsed() {
        this.isContentWidthFixed = false;
        this.options.sidenavCollapsed = !this.options.sidenavCollapsed;
        this.resetCollapsedState();
    }

    resetCollapsedState(timer = 400) {
        setTimeout(() => this.settings.setOptions(this.options), timer);
    }

    onSidenavClosedStart() {
        this.isContentWidthFixed = false;
    }

    onSidenavOpenedChange(isOpened: boolean) {
        this.isCollapsedWidthFixed = !this.isOver;
        this.options.sidenavOpened = isOpened;
    }
}
