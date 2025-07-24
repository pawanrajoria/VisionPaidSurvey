import { inject } from '@angular/core';
import { BrowserService } from './browser.service';
import { UserService } from './components/layout/user.service';

export abstract class BaseComponent {
    protected readonly browserService = inject(BrowserService);
    protected win: Window | null = null;
    protected nav: Navigator | null = null;
    protected doc: Document | null = null;
    protected isBrowser: boolean = false;

    readonly userService = inject(UserService);

    constructor() {
        this.bindBrowserSetting(); // ✅ safe in constructor
    }

    protected bindBrowserSetting(): void {
        this.isBrowser = this.browserService.isPlatformBrowser;
        if (this.isBrowser) {
            this.win = this.browserService.window;
            this.nav = this.browserService.navigator;
            this.doc = this.browserService.document;
        }
    }

    async logUserActivity(pageName: string, eventName: string, status: string, remarks: string) {
        await this.userService.logActivity({ eventName: eventName, pageName: pageName, status: status, remarks: remarks });
    }
}
