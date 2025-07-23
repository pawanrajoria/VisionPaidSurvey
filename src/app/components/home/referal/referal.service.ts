import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "../../../config.service";

@Injectable({ providedIn: 'root' })
export class ReferalService {

    constructor(private http: HttpClient, private config: ConfigService) {
    }

    async getReferInfo(): Promise<any> {
        return await this.http.get<any>(this.config.baseUrl + "user/get-refer-friend").toPromise();
    }

    async referFriend(request: any): Promise<any> {
        return await this.http.post<any>(this.config.baseUrl + "user/redeem-refer-friend", request).toPromise();
    }
}