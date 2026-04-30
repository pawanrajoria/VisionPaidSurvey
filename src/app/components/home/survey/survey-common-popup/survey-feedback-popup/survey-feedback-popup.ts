import { Component, inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { SharedModule } from "../../../../../shared.module";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'app-survey-feedback-popup',
    imports: [SharedModule],
    templateUrl: './survey-feedback-popup.html',
    styleUrls: ['./survey-feedback-popup.scss']
})
export class SurveyFeedBackPopupComponent implements OnInit {
    readonly dialogRef = inject(MatDialogRef<SurveyFeedBackPopupComponent>);
    selectedReason: string = '';
    ngOnInit() {
    }

    submitFeedback() {
        this.dialogRef.close("submitForm");
    }

    closeHappened() {
        this.dialogRef.close("close");
    }
}