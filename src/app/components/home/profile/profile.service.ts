import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { IProfileVM, IUserDeleteVM, IUserDetailsUpdateVM, IUserUpdateVM } from "./profile.vm";
import { ConfigService } from "../../../config.service";

@Injectable({ providedIn: 'root' })
export class ProfileService {

    constructor(private http: HttpClient, private config: ConfigService) {
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
}