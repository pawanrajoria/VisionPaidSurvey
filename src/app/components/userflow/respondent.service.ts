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
}