import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from '../../config.service';

@Injectable({
    providedIn: "root"
})
export class OfferwallService {

    baseUrl: string = "https://apicrtool.azurewebsites.net/userflow/api";
    // baseUrl:string="https://localhost:7156/userflow/api";
    constructor(private http: HttpClient, private config: ConfigService) {
    }

    async getIframeUrl(request: any): Promise<any> {
        return await this.http.post<any>(`${this.baseUrl}/apprespondent/get-iframeurl`, request).toPromise();
    }

}