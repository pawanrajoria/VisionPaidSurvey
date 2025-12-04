import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ConfigService } from "../../config.service";
import { RespondentEndSurveyResponseVM, RespondentEndSurveyVM, RespondentEntryRequestVM, RespondentEntryResponseVM, RespondentSubmitVM } from "./respondent.vm";
@Injectable({
    providedIn: "root"
})
export class RespondentService {
    userEmail: string = "";
    constructor(private http: HttpClient, private configService: ConfigService) {

    }

    async enterRespondent(request: RespondentEntryRequestVM): Promise<any> {
        const self = this;
        return self.http.post<RespondentEntryResponseVM>(self.configService.userflowEndpoint + "Respondent/Entry", request).toPromise();
    }

    async submitRespondent(request: RespondentSubmitVM): Promise<any> {
        const self = this;
        return self.http.post<RespondentEntryResponseVM>(self.configService.userflowEndpoint + "Respondent/SubmitEntry", request).toPromise();
    }

    async completeRespondent(request: RespondentEndSurveyVM): Promise<any> {
        const self = this;
        return self.http.post<RespondentEndSurveyResponseVM>(self.configService.userflowEndpoint + "Respondent/CompleteEntry", request).toPromise();
    }

    async endRespondent(token: any, transId: any, statusId: any): Promise<any> {
        const self = this;
        return self.http.get<string>(self.configService.userflowEndpoint + "Respondent/getredirect?respondentToken=" + token + "&transactionId=" + transId + "&statusId=" + statusId).toPromise();
    }

    async callCPXSurveyResponseApi(transId: any): Promise<any> {
        const self = this;
        return self.http.get<string>("https://publisher.cpx-research.com/index.php?page=api-check-transaction-id&transaction_id=" + transId + "&api_key=f2a1e7f079bc1e5ee9eb29fa3e101ec1").toPromise();
    }
}