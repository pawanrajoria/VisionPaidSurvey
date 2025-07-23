import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "../../../config.service";
import { UserWithdrawalRequestVM } from "./reward.vm";

@Injectable({ providedIn: 'root' })
export class RewardService {


    constructor(private http: HttpClient, private config: ConfigService) {
    }

    async bindRewardInfo(request: any) {
        return await this.http.post<any>(this.config.baseUrl + "giftcard/get-giftcards", request).toPromise();
    }

    async requestUserWithdrawal(request: UserWithdrawalRequestVM): Promise<any> {
        return await this.http.post<any>(this.config.baseUrl + "withdrawal/withdraw", request).toPromise();
    }
}