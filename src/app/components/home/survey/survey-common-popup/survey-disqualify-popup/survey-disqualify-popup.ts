import { Component, inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { SharedModule } from "../../../../../shared.module";
import { MatDialogRef } from "@angular/material/dialog";
import { SurveyService } from "../../survey.service";

@Component({
    selector: 'app-survey-disqualify-popup',
    imports: [SharedModule],
    templateUrl: './survey-disqualify-popup.html',
    styleUrls: ['./survey-disqualify-popup.scss']
})
export class SurveyDisqualifyPopupComponent implements OnInit {
    readonly dialogRef = inject(MatDialogRef<SurveyDisqualifyPopupComponent>);
    readonly surveyService = inject(SurveyService);

    earnedBonusCoins: number = 0;
    ngOnInit() {
    }

    checkAvailableSurveys() {
        this.surveyService.triggerSurveyRefresh();
        this.dialogRef.close();
    }

    closeSurvey() {
        this.dialogRef.close("close");
    }
}