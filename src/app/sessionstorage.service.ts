import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class SessionStorageService {
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    setItem(key: string, value: string): void {
        if (this.isBrowser) {
            sessionStorage.setItem(key, value);
        }
    }

    getItem(key: string): string | null {
        if (this.isBrowser) {
            return sessionStorage.getItem(key);
        }
        return null;
    }

    removeItem(key: string): void {
        if (this.isBrowser) {
            sessionStorage.removeItem(key);
        }
    }

    clear(): void {
        if (this.isBrowser) {
            sessionStorage.clear();
        }
    }

    // Typed JSON helpers
    getJson<T>(key: string): T | null {
        if (!this.isBrowser) return null;
        try {
            const raw = sessionStorage.getItem(key);
            return raw ? JSON.parse(raw) as T : null;
        } catch {
            return null;
        }
    }

    setJson<T>(key: string, value: T): void {
        if (this.isBrowser) {
            sessionStorage.setItem(key, JSON.stringify(value));
        }
    }
}
