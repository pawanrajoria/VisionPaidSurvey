import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "../../config.service";

@Injectable({ providedIn: 'root' })
export class AdminService {

    constructor(private http: HttpClient, private config: ConfigService,) {
    }


    async getDashboardHistory(): Promise<any> {
        return await this.http.get<any>(this.config.baseUrl + "admin/get-dashboard-history").toPromise();
    }
}