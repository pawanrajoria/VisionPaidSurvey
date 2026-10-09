import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as CryptoJS from 'crypto-js';
declare function getDuid(callback: any, localStr: any): any;
import { LocalStorageService } from "../../localstorage.service";

@Injectable({ providedIn: "root" })
export class HelperService {
  private readonly SECRET_KEY = "a0f3dc257c884e299dfdde9088e6e0c9";

  constructor(
    private localStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) { }

  public async getOrInitializeDuid(): Promise<string | null> {
    // SSR Check: If on server, we can't access LocalStorage. Return null immediately.
    if (!isPlatformBrowser(this.platformId)) {
      return null;
    }

    const duid = this.localStorageService.getItem('Duid');
    const appToken = this.localStorageService.getItem('AppToken');

    if (duid && duid.length === 32 && appToken) {
      try {
        const bytes = CryptoJS.AES.decrypt(appToken, this.SECRET_KEY);
        if (duid === bytes.toString(CryptoJS.enc.Utf8)) {
          return duid;
        }
      } catch (e) {
        console.error("Decryption failed");
      }
    }

    return this.initializeDuid();
  }

  private fingerprintScript: Promise<void> | null = null;

  /**
   * Loads /assets/js/fingerprint.js on demand. It used to be a <script> in index.html,
   * so its font/canvas probing (about a second of forced layout on a phone) ran on
   * every page view, including public pages that never use the device id.
   */
  private loadFingerprintScript(): Promise<void> {
    const win = typeof window !== 'undefined' ? (window as any) : null;
    if (!win || typeof win.getDuid === 'function') return Promise.resolve();

    if (!this.fingerprintScript) {
      this.fingerprintScript = new Promise<void>((resolve) => {
        const script = document.createElement('script');
        script.src = '/assets/js/fingerprint.js';
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => { this.fingerprintScript = null; resolve(); };
        document.head.appendChild(script);
      });
    }
    return this.fingerprintScript;
  }

  private async initializeDuid(): Promise<string> {
    await this.loadFingerprintScript();

    return new Promise((resolve) => {
      // Safety check for window usage
      const win = typeof window !== 'undefined' ? (window as any) : null;

      if (win && typeof win.getDuid === 'function') {
        win.getDuid((newDuid: string) => {
          if (newDuid) {
            this.saveDuid(newDuid);
            resolve(newDuid);
          } else {
            resolve("");
          }
        }, this.localStorageService);
      } else {
        resolve("");
      }
    });
  }

  private saveDuid(duid: string): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const encrypted = CryptoJS.AES.encrypt(duid, this.SECRET_KEY).toString();
    this.localStorageService.setItem('Duid', duid);
    this.localStorageService.setItem('AppToken', encrypted);
  }
}