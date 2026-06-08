import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ISurveyVM } from "./survey.vm";
import { ConfigService } from "../../../config.service";

@Injectable({ providedIn: 'root' })
export class SurveyService {

    offerspartners = [
        { gradient: 'linear-gradient(180deg, #003B2F 0%, #005C47 100%)', id: 2, name: 'Bit Lab', logo: 'assets/images/partners/BitLabsWhiteLogo.png', rating: 5, bonus: 50, description: 'RevU+', max: "1000", tag: 'Top Rated', tagClass: 'top-rated' },
        { gradient: 'linear-gradient(180deg, #2E1052 0%, #4B2185 100%)', id: 4, name: 'TimeWall', logo: 'assets/images/partners/timewall-logo.png', rating: 5, bonus: 20, max: "500", tag: 'Quick & Easy', tagClass: 'quick-easy' },
        { gradient: 'linear-gradient(180deg, #00337C 0%, #0054A6 100%)', id: 15, name: 'Torox', logo: 'assets/images/partners/torox.png', rating: 5, bonus: 20, max: "600", tag: 'High Paying', tagClass: 'high-paying' },
        { gradient: 'linear-gradient(180deg, #334155 0%, #1e293b 100%)', id: 11, name: 'Lootably', logo: 'assets/images/partners/lootably.png', rating: 5, bonus: 20, max: "400", tag: 'Popular', tagClass: 'popular' },
        { gradient: 'linear-gradient(180deg, #0f172a 0%, #334155 100%)', id: 14, name: 'MMWALL', logo: 'assets/images/partners/mmwall.svg', rating: 5, bonus: 20, max: "300", tag: 'New', tagClass: 'quick-easy' },
        { gradient: 'linear-gradient(180deg, #701a75 0%, #4a044e 100%)', id: 16, name: 'Revlum', logo: 'assets/images/partners/revlum.png', rating: 5, bonus: 20, max: "1200", tag: 'High Paying', tagClass: 'high-paying' },
        { gradient: 'linear-gradient(180deg, #D16D00 0%, #F28C00 100%)', id: 3, name: 'Notik', logo: 'assets/images/partners/notik_logo.png', rating: 4, bonus: 20, max: "1500", tag: 'Hot', tagClass: 'high-paying' },
        { gradient: 'linear-gradient(180deg, #1e3a8a 0%, #1e40af 100%)', id: 5, name: 'CPA Lead', logo: 'assets/images/partners/dark_logo_cpalead.webp', rating: 3, bonus: 50, max: "100", tag: 'Popular', tagClass: 'popular' },
    ];

    surveyspartners = [
        { id: 9, name: 'CPX Research', logo: 'assets/images/partners/logo-cpx-reserach-green.svg', rating: 4.5, bonus: 50, max: "4K" },
        { id: 2, name: 'Bit Lab', logo: 'assets/images/partners/BitLabsWhiteLogo.png', rating: 5, bonus: 50, description: 'RevU+', max: "3K" },
        { id: 10, name: 'SaySo', logo: 'assets/images/partners/sayso.webp', rating: 3.8, bonus: 50, description: 'RevU+', max: "5K" },
        { id: 18, name: 'Dynata', logo: 'assets/images/partners/dynata.jpg', rating: 5, bonus: 50, description: 'Dynata', max: "10K" },
        { id: 20, name: 'TheoremReach', logo: 'assets/images/partners/theoremreach.svg', rating: 5, bonus: 50, description: 'TheoremReach', max: "5K" },
        { id: 21, name: 'PrimeEarn', logo: 'assets/images/partners/prime.png', rating: 5, bonus: 50, description: 'PrimeEarn', max: "10K" }
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