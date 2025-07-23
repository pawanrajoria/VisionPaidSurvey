import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { firstValueFrom } from "rxjs";
import { ConfigService } from "../../../config.service";


@Injectable({ providedIn: 'root' })
export class HelpService {

    constructor(private http: HttpClient, private config: ConfigService) {
    }

    async submitQuestion(formData: FormData): Promise<any> {
        return await this.http.post<any>(this.config.baseUrl + "help/submit-help-question", formData).toPromise();
    }

    async submitContactUs(formData: FormData): Promise<any> {
        return await this.http.post<any>(this.config.baseUrl + "help/submit-contact-us", formData).toPromise();
    }

    async submitDotNotSellInfo(formData: FormData): Promise<any> {
        return await this.http.post<any>(this.config.baseUrl + "help/submit-securityconcern", formData).toPromise();
    }
}