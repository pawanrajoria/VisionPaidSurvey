import { AfterViewInit, Component, computed, Inject, OnDestroy, OnInit, signal, ViewChild } from "@angular/core";
import { SharedModule } from "../../shared.module";
import { filter, map, Observable, shareReplay, Subscription } from "rxjs";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { sidebarMenu } from "./layout.interface"
import { HeaderComponent } from "./header/header.component";
import { FooterComponent } from "./footer/footer.component";
import { NavigationEnd, Router, RouterModule } from "@angular/router";
import { AppNavItemComponent } from "./sidebar/nav-item/nav-item.component";
import { SidebarComponent } from "./sidebar/sidebar.component";
import { NgScrollbarModule } from "ngx-scrollbar";
import { TablerIconsModule } from 'angular-tabler-icons';
import { MatSidenav, MatSidenavContent } from "@angular/material/sidenav";
import { CoreService } from "./core.service";
import { DOCUMENT } from "@angular/common";
import { AccountService } from "../home/account.service";
import { NavItem } from "./sidebar/nav-item/nav-item";
import { LoaderService } from "./loader.service";

const MOBILE_VIEW = 'screen and (max-width: 768px)';
const TABLET_VIEW = 'screen and (min-width: 769px) and (max-width: 1024px)';

@Component({
    selector: 'app-layout',
    imports: [RouterModule,
        AppNavItemComponent,
        SharedModule,
        SidebarComponent,
        NgScrollbarModule,
        HeaderComponent],
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements AfterViewInit, OnDestroy {
    @ViewChild('leftsidenav') public sidenav!: MatSidenav;
    @ViewChild('content', { static: true }) content!: MatSidenavContent;

    resView = false;
    options!: ReturnType<CoreService['getOptions']>;
    allowedMenus: NavItem[] = [];

    private layoutChangesSubscription = Subscription.EMPTY;
    private isMobileScreen = false;
    private isContentWidthFixed = true;
    private isCollapsedWidthFixed = false;
    private htmlElement!: HTMLHtmlElement;

    get isOver(): boolean {
        return this.isMobileScreen;
    }

    constructor(
        private settings: CoreService,
        private router: Router,
        private breakpointObserver: BreakpointObserver,
        private accountService: AccountService,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.options = this.settings.getOptions(); // ✅ Move here
        this.htmlElement = document.querySelector('html')!;

        this.layoutChangesSubscription = this.breakpointObserver
            .observe([MOBILE_VIEW, TABLET_VIEW])
            .subscribe((state) => {
                this.options.sidenavOpened = true;
                this.isMobileScreen = state.breakpoints[MOBILE_VIEW];
                if (!this.options.sidenavCollapsed) {
                    this.options.sidenavCollapsed = state.breakpoints[TABLET_VIEW];
                }
            });

        this.router.events
            .pipe(filter((event) => event instanceof NavigationEnd))
            .subscribe(() => {
                this.content.scrollTo({ top: 0 });
            });
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
