import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "../../config.service";
import { NavItem } from "../layout/sidebar/nav-item/nav-item";
import { IUserbalanceInfoVM } from "./account.vm";
import { LocalStorageService } from "../../localstorage.service";

@Injectable({ providedIn: 'root' })
export class AccountService {
    private allowedMenus: NavItem[] = [];
    private userBalanceInfo: IUserbalanceInfoVM = {};


    constructor(private http: HttpClient, private config: ConfigService,
        private localStorageService: LocalStorageService) {
    }

    setUserBalanceInfo(balance: IUserbalanceInfoVM) {
        this.userBalanceInfo = balance;
    }

    getAllowedMenus(): NavItem[] {
        const session: any = this.localStorageService.getItem("token");
        if (!!session) {
            const tokenData = (JSON.parse(atob(session.split('.')[1])));
            if (!!tokenData.rolePermissions)
                return JSON.parse(tokenData.rolePermissions).sort((a: any, b: any) => a.orderNo - b.orderNo);
        }

        return [];
    }

    getUserBalanceInfo(): IUserbalanceInfoVM {
        return this.userBalanceInfo;
    }

    // getUserBalance(): string {
    //     return this.userBalance;
    // }

    // getConvertedBalance(): string {
    //     return this.convertedBalance;
    // }


    async getuserinfo(): Promise<any> {
        return await this.http.get<any>(this.config.baseUrl + "account/get-user-info").toPromise();
    }

    get userEmail(): string | null {
        return "";
    }

}