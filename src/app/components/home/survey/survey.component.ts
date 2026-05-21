import { Component, inject, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { ISurveyVM } from "./survey.vm";
import { SurveyService } from "./survey.service";
import { MatDialog } from "@angular/material/dialog";
import { SurveyQualifyPopupComponent } from "./survey-common-popup/survey-qualify-popup/survey-qualify-popup";
import { SurveyFeedBackPopupComponent } from "./survey-common-popup/survey-feedback-popup/survey-feedback-popup";
import { SurveyInstructionPopupComponent } from "./survey-common-popup/survey-instruction-popup/survey-instruction-popup";
import { BaseComponent } from "../../../base.component";
import { FraudService } from "../../../frauddetection.service";

@Component({
    selector: 'app-survey',
    imports: [SharedModule],
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.scss']
})
export class SurveyComponent extends BaseComponent implements OnInit {
    isApiLoaded = false;
    surveys: Array<ISurveyVM> = [];
    filteredSurveys = [...this.surveys];

    links = ['Best Match Surveys', 'Short Surveys', 'Most Points Surveys'];
    activeLink = this.links[0];
    surveyType: string = "Best Match Surveys";
    readonly dialog = inject(MatDialog);

    constructor(private surveyService: SurveyService, private fraudService: FraudService) {
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

    async startSurvey(item: ISurveyVM) {
        let winNew: Window | null = null;

        if (this.win) {
            // Open immediately (user gesture safe)
            winNew = this.win.open('', '_blank');

            if (!winNew) {
                alert('Popup blocked. Please allow popups for this site.');
                return;
            }
        }

        const fraudSignals: any = await this.fraudService.collectSignals();

        if (fraudSignals && fraudSignals.decision === "BLOCK") {
            await this.logUserActivity("Survey", "StartSurvey", "SurveyScore", fraudSignals.decision);
            winNew?.close(); // close opened tab if blocked
            return;
        }

        // Now redirect the already opened tab
        if (winNew) {
            winNew.location.href = item.clickUrl;
        }

        await this.logUserActivity("Survey", "StartSurvey", "Click", item.clickUrl);
        await this.feedbackSurvey(item);
        await this.getSurveys();
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
        const self = this;

        // self.qualifySurvey(item);
        self.openSurveyInstruction(item);
    }

    async qualifySurvey(item: ISurveyVM) {
        const dialofref = this.dialog.open(SurveyQualifyPopupComponent);
        dialofref.afterClosed().subscribe(async (result) => {
            if (result === "participate") {
                dialofref.close();
                await this.startSurvey(item);
            } else if (result === "close") {
                dialofref.close();
            }
        });
    }

    async feedbackSurvey(item: ISurveyVM) {
        const dialofref = this.dialog.open(SurveyFeedBackPopupComponent);
        dialofref.afterClosed().subscribe(async (result) => {
            if (result === "submitForm") {
                // call rating api
                dialofref.close();
            } else if (result === "close") {
                // this.getSurveys();
                dialofref.close();
            }
        });
    }

    async openSurveyInstruction(item: ISurveyVM) {
        const dialofref = this.dialog.open(SurveyInstructionPopupComponent);
        dialofref.afterClosed().subscribe(async (result) => {
            if (result === "startSurvey") {
                await this.startSurvey(item);
                dialofref.close();
            } else if (result === "close") {
                dialofref.close();
            }
        });
    }

    hasProfileSurvey(): boolean {
        return this.filteredSurveys?.some(survey => survey.isProfileSurvey === true) ?? false;
    }
}