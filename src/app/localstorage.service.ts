import { isPlatformBrowser } from "@angular/common";
import { Injectable, Inject, PLATFORM_ID } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LocalStorageService {

    constructor(@Inject(PLATFORM_ID) private platformId: Object) { }

    setItem(key: string, value: any) {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.setItem(key, JSON.stringify(value));
        }
    }

    getItem(key: string) {
        if (isPlatformBrowser(this.platformId)) {
            return localStorage.getItem(key);
        }

        return null;
    }

    removeItem(key: string) {
        if (isPlatformBrowser(this.platformId)) {
            localStorage.removeItem(key);
        }
    }
}