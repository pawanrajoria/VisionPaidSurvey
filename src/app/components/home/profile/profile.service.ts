import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IProfileVM, IUserDeleteVM, IUserDetailsUpdateVM, IUserUpdateVM } from "./profile.vm";
import { ConfigService } from "../../../config.service";
import { LocalStorageService } from "../../../localstorage.service";
import { Router } from "@angular/router";

@Injectable({ providedIn: 'root' })
export class ProfileService {

    constructor(private http: HttpClient, private config: ConfigService, 
        private localStorageService: LocalStorageService,private router:Router) {
    }

    async getAccountInfo(): Promise<any> {
        return await this.http.get<any>(this.config.baseUrl + "account/get-user-details").toPromise();
    }

    async getUserActivityInfo(): Promise<any> {
        return await this.http.get<any>(this.config.baseUrl + "account/get-user-activity").toPromise();
    }

    async getPointInfo(): Promise<any> {
        return await this.http.get<any>(this.config.baseUrl + "account/get-point-details").toPromise();
    }

    async getSurveyActivityInfo(): Promise<any> {
        return await this.http.get<any>(this.config.baseUrl + "account/get-survey-activity").toPromise();
    }

    async getOfferActivityInfo(): Promise<any> {
        return await this.http.get<any>(this.config.baseUrl + "account/get-offer-activity").toPromise();
    }

    async updateUser(request: IUserUpdateVM): Promise<any> {
        return await this.http.put<any>(this.config.baseUrl + "user/update-user", request).toPromise();
    }

    async updateUserDetails(request: IUserDetailsUpdateVM): Promise<any> {
        return await this.http.put<any>(this.config.baseUrl + "user/update-userdetails", request).toPromise();
    }

    async deleteUser(request: IUserDeleteVM): Promise<any> {
        return await this.http.put<any>(this.config.baseUrl + "user/delete-user", request).toPromise();
    }


    async markUserInstructed(): Promise<any> {
        const response = await this.http.get<any>(this.config.baseUrl + "user/mark-user-instruction").toPromise();
        if (!!response && response.token) {
            this.localStorageService.setItem("token", response.token);
            this.router.navigate(['/app']);
        }
    }
}