import { Injectable } from "@angular/core";
import * as CryptoJS from 'crypto-js';
// declare function getDuid(callback: any, localStr: any): any;
import { LocalStorageService } from "../../localstorage.service";

@Injectable({
  providedIn: "root"
})
export class HelperService {
  key: string = "a0f3dc257c884e299dfdde9088e6e0c9";
  constructor(private localStorageService: LocalStorageService) { }

  fetchDuid() {
    const duid = this.localStorageService.getItem('Duid');
    const appToken: any = this.localStorageService.getItem('AppToken');
    console.log("duid", duid);
    console.log("appToken", appToken);
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
    // if (this.fetchDuid() == "" && !!getDuid) {
    //   getDuid(finalCallback, this.localStorageService);
    // }
  }

}

const finalCallback: any = (duid: any, localStr: any) => {
  if (!!duid) {
    localStr.setItem('Duid', duid);
    const duidHash = CryptoJS.AES.encrypt(duid, "a0f3dc257c884e299dfdde9088e6e0c9");
    localStr.setItem('AppToken', duidHash.toString());
  }
}
