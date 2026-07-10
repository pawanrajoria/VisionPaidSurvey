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

  private initializeDuid(): Promise<string> {
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