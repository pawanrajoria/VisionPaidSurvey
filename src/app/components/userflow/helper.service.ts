import { Inject, Injectable, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import * as CryptoJS from 'crypto-js';
declare function getDuid(callback: any, localStr: any): any;
import { LocalStorageService } from "../../localstorage.service";

@Injectable({
  providedIn: "root"
})
export class HelperService {
  key: string = "a0f3dc257c884e299dfdde9088e6e0c9";
  constructor(private localStorageService: LocalStorageService, @Inject(PLATFORM_ID) private platformId: Object) { }

  fetchDuid() {
    const duid = this.localStorageService.getItem('Duid');
    const appToken: any = this.localStorageService.getItem('AppToken');
    if (!duid || duid.length != 32)
      return "";
    else {
      const bytes = CryptoJS.AES.decrypt(appToken, this.key);

      const encryptedDuid = bytes.toString(CryptoJS.enc.Utf8);
      if (duid == encryptedDuid)
        return duid;

      else return "";
    }
  }

  setDuid() {
    if (isPlatformBrowser(this.platformId)) {
      if (typeof (window as any).getDuid === 'function') { // Example for global function
        const duid = (window as any).getDuid(finalCallback, this.localStorageService);
      } else {
        console.warn("getDuid function not found in browser environment.");
      }
    }
    else {
      console.log('Running setDuid in server environment (SSR)');
    }
  }

}
const finalCallback: any = (duid: any, localStr: any) => {
  if (!!duid) {
    localStr.setItem('Duid', duid);
    const duidHash = CryptoJS.AES.encrypt(duid, "a0f3dc257c884e299dfdde9088e6e0c9");
    localStr.setItem('AppToken', duidHash.toString());
  }
}
