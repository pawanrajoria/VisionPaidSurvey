import { Injectable, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PwaInstallService {
    private _canInstall = new BehaviorSubject<boolean>(false);
    canInstall$ = this._canInstall.asObservable();

    // Use a specific type for the BeforeInstallPromptEvent if available, 
    // otherwise 'any' is fine for this specific browser API.
    private deferredPrompt: any;

    constructor(
        @Inject(PLATFORM_ID) private platformId: object,
        @Inject(DOCUMENT) private document: Document
    ) {
        this.initInstallListeners();
    }

    private initInstallListeners(): void {
        // Use Angular's utility to check if we are on the browser
        if (isPlatformBrowser(this.platformId)) {
            const windowRef = this.document.defaultView;

            if (windowRef) {
                windowRef.addEventListener('beforeinstallprompt', (e: any) => {
                    // Prevent the mini-infobar from appearing on mobile
                    e.preventDefault();
                    // Stash the event so it can be triggered later.
                    this.deferredPrompt = e;
                    // Update UI to show the install button
                    this._canInstall.next(true);
                });

                windowRef.addEventListener('appinstalled', () => {
                    // Log install, hide button, and clear prompt
                    this.deferredPrompt = null;
                    this._canInstall.next(false);
                });
            }
        }
    }

    async promptInstall(): Promise<boolean> {
        if (!this.deferredPrompt || !isPlatformBrowser(this.platformId)) {
            return false;
        }

        // Show the native install prompt
        this.deferredPrompt.prompt();

        // Wait for the user to respond to the prompt
        const { outcome } = await this.deferredPrompt.userChoice;

        // We've used the prompt, and can't use it again
        this.deferredPrompt = null;
        this._canInstall.next(false);

        return outcome === 'accepted';
    }
}