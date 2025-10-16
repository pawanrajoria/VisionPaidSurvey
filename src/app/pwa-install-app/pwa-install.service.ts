import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PwaInstallService {
    // Observable for showing the install button
    private _canInstall = new BehaviorSubject<boolean>(false);
    canInstall$ = this._canInstall.asObservable();

    private deferredPrompt: any;

    constructor() {
        // Only attach in browser
        if (typeof window !== 'undefined') {
            window.addEventListener('beforeinstallprompt', (e: any) => {
                e.preventDefault();
                this.deferredPrompt = e;
                this._canInstall.next(true);
            });
        }
    }

    async promptInstall() {
        if (!this.deferredPrompt) return false;

        this.deferredPrompt.prompt();
        const { outcome } = await this.deferredPrompt.userChoice;
        this.deferredPrompt = null;
        this._canInstall.next(false);
        return outcome === 'accepted';
    }
}
