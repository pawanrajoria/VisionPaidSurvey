import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "../../../config.service";

@Injectable({ providedIn: 'root' })
export class OfferService {

    constructor(private http: HttpClient, private config: ConfigService) {
    }

    async getOffers(): Promise<any> {
        return await this.http.get<any>(this.config.baseUrl + "offer/get-offers").toPromise();
    }

    async getOfferWallDetailById(id:number): Promise<any> {
        return await this.http.get<any>(this.config.baseUrl + "offer/get-offers/"+id).toPromise();
    }
}