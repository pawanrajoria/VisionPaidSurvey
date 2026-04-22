import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { ConfigService } from "../../config.service";
import { IUserActivityVM } from "./common.vm";

@Injectable({ providedIn: 'root' })
export class UserService {


    constructor(private http: HttpClient, private config: ConfigService) {
    }

    async logActivity(request: IUserActivityVM): Promise<any> {
        // console.log("Logging user activity:", this.config.baseUrl + "auth/log-activity");
        
        return await this.http.post<any>(this.config.baseUrl + "auth/log-activity", request).toPromise();
    }
    
}
