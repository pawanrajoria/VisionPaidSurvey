import { Component, inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { SharedModule } from "../../../../../shared.module";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'app-survey-qualify-popup',
    imports: [SharedModule],
    templateUrl: './survey-qualify-popup.html',
    styleUrls: ['./survey-qualify-popup.scss']
})
export class SurveyQualifyPopupComponent implements OnInit {
    readonly dialogRef = inject(MatDialogRef<SurveyQualifyPopupComponent>);
    ngOnInit() {
    }

    participateSurvey() {
        this.dialogRef.close("participate");
    }

    closeSurvey() {
        this.dialogRef.close("close");
    }
}