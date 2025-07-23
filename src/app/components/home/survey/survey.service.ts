import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ISurveyVM } from "./survey.vm";
import { ConfigService } from "../../../config.service";

@Injectable({ providedIn: 'root' })
export class SurveyService {

    constructor(private http: HttpClient, private config: ConfigService) {
    }

    async getSurveys(): Promise<any> {
        return await this.http.get<any>(this.config.baseUrl + "survey/get-surveys").toPromise();
    }

    // async getSurveys(): Promise<Array<ISurveyVM>> {
    //     return [{
    //         id: 1,
    //         loi: '10',
    //         points: 20,
    //         rating: 5,
    //         title: 'Hot Survey'
    //     }, {
    //         id: 1,
    //         loi: '10',
    //         points: 20,
    //         rating: 5,
    //         title: 'Hot Survey'
    //     }, {
    //         id: 1,
    //         loi: '10',
    //         points: 20,
    //         rating: 5,
    //         title: 'Hot Survey'
    //     }, {
    //         id: 1,
    //         loi: '10',
    //         points: 20,
    //         rating: 5,
    //         title: 'Hot Survey'
    //     }, {
    //         id: 1,
    //         loi: '10',
    //         points: 20,
    //         rating: 5,
    //         title: 'Hot Survey'
    //     }];
    // }
}