import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ISurveyVM } from "./survey.vm";
import { ConfigService } from "../../../config.service";

@Injectable({ providedIn: 'root' })
export class SurveyService {

    offerspartners = [
        { id: 2, name: 'Bit Lab', logo: 'assets/images/partners/BitLabsWhiteLogo.png', rating: 5, bonus: 50, description: 'RevU+' },
        { id: 4, name: 'TimeWall', logo: 'assets/images/partners/timewall-logo.png', rating: 5, bonus: 20 },
        { id: 15, name: 'Torox', logo: 'assets/images/partners/torox.png', rating: 5, bonus: 20 },
        { id: 11, name: 'Lootably', logo: 'assets/images/partners/lootably.png', rating: 5, bonus: 20 },
        { id: 14, name: 'MMWALL', logo: 'assets/images/partners/mmwall.svg', rating: 5, bonus: 20 },
        { id: 16, name: 'Revlum', logo: 'assets/images/partners/revlum.png', rating: 5, bonus: 20 },
        { id: 3, name: 'Notik', logo: 'assets/images/partners/notik_logo.png', rating: 4, bonus: 20 },
        { id: 5, name: 'CPA Lead', logo: 'assets/images/partners/dark_logo_cpalead.webp', rating: 3, bonus: 50 },
    ];

    surveyspartners = [
        { id: 2, name: 'Bit Lab', logo: 'assets/images/partners/BitLabsWhiteLogo.png', rating: 5, bonus: 50, description: 'RevU+' },
        { id: 9, name: 'CPX Research', logo: 'assets/images/partners/logo-cpx-reserach-green.svg', rating: 4, bonus: 50 },
        { id: 10, name: 'SaySo', logo: 'assets/images/partners/sayso.webp', rating: 5, bonus: 50, description: 'RevU+' },
    ];

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