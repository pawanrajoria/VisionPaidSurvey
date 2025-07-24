import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class LocalStorageService {
    private isBrowser: boolean;

    constructor(@Inject(PLATFORM_ID) private platformId: Object) {
        this.isBrowser = isPlatformBrowser(platformId);
    }

    setItem(key: string, value: string): void {
        if (this.isBrowser) {
            localStorage.setItem(key, value);
        }
    }

    getItem(key: string): string | null {
        if (this.isBrowser) {
            return localStorage.getItem(key);
        }
        return null;
    }

    removeItem(key: string): void {
        if (this.isBrowser) {
            localStorage.removeItem(key);
        }
    }

    clear(): void {
        if (this.isBrowser) {
            localStorage.clear();
        }
    }

    // Optional: use generic parsing for stored JSON values
    getJson<T>(key: string): T | null {
        if (!this.isBrowser) return null;
        try {
            const raw = localStorage.getItem(key);
            return raw ? JSON.parse(raw) as T : null;
        } catch {
            return null;
        }
    }

    setJson<T>(key: string, value: T): void {
        if (this.isBrowser) {
            localStorage.setItem(key, JSON.stringify(value));
        }
    }
}
