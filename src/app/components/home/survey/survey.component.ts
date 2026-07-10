import { Component, inject, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { ISurveyVM } from "./survey.vm";
import { SurveyService } from "./survey.service";
import { SurveyInstructionPopupComponent } from "./survey-common-popup/survey-instruction-popup/survey-instruction-popup";
import { BaseSurveyComponent } from "../../../base.survey.component";

@Component({
    selector: 'app-survey',
    imports: [SharedModule],
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.scss']
})
export class SurveyComponent extends BaseSurveyComponent implements OnInit {
    isApiLoaded = false;
    surveys: Array<ISurveyVM> = [];
    filteredSurveys = [...this.surveys];

    links = ['Best Match Surveys', 'Short Surveys', 'Most Points Surveys'];
    activeLink = this.links[0];
    surveyType: string = "Best Match Surveys";

    constructor(private surveyService: SurveyService) {
        super();
    }

    async ngOnInit() {
        this.fraudService.resetTracking();
        this.fraudService.startTracking();


        await this.getSurveys();
        this.isApiLoaded = true;
        this.filterItems();
    }

    changeSurveyType(linkType: string) {
        this.surveyType = linkType;
        this.filterItems();
    }

    async getSurveys() {
        const self = this;
        const output = await self.surveyService.getSurveys();
        if (!!output && !!output.surveys && output.surveys.length > 0) {
            self.surveys = output.surveys.sort((a: any, b: any) => {
                return (b.isProfileSurvey === true ? 1 : 0) - (a.isProfileSurvey === true ? 1 : 0);
            });
        }

    }

    filterItems() {
        this.filteredSurveys = this.surveys.sort((a, b) => {
            if (this.surveyType === 'Most Points Surveys') {
                return b.points - a.points;
            }
            else if (this.surveyType === 'Short Surveys') {
                return parseInt(a.loi) - parseInt(b.loi);
            } else {
                return parseInt(b.conversion) - parseInt(a.conversion);
            }
        });
    }

    getStars(rating: string): string[] {
        const stars = [];
        for (let i = 1; i <= 5; i++) {
            if (parseInt(rating) >= i) {
                stars.push('filled');
            } else if (parseInt(rating) > i - 1 && parseInt(rating) < i) {
                stars.push('half');
            } else {
                stars.push('empty');
            }
        }
        return stars;
    }

    async attemptSurvey(item: ISurveyVM) {
        if (item.isProfileSurvey) {
            this.openSurveyInstruction(item);
        }
        else {
            this.startSurvey(item);
            // this.getSurveys();
        }
    }




    async openSurveyInstruction(item: ISurveyVM) {
        const dialofref = this.dialog.open(SurveyInstructionPopupComponent);
        dialofref.afterClosed().subscribe(async (result) => {
            if (result === "startSurvey") {
                await this.startSurvey(item);
                dialofref.close();
                this.getSurveys();
            } else if (result === "close") {
                dialofref.close();
            }
        });
    }

    hasProfileSurvey(): boolean {
        return this.filteredSurveys?.some(survey => survey.isProfileSurvey === true) ?? false;
    }
}