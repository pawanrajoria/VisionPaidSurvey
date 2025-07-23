import { Component, inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { SharedModule } from "../../../../../shared.module";
import { MatDialogRef } from "@angular/material/dialog";

@Component({
    selector: 'app-survey-instruction-popup',
    imports: [SharedModule],
    templateUrl: './survey-instruction-popup.html',
    styleUrls: ['./survey-instruction-popup.scss']
})
export class SurveyInstructionPopupComponent implements OnInit {
    readonly dialogRef = inject(MatDialogRef<SurveyInstructionPopupComponent>);
    ngOnInit() {
    }

    startSurvey() {
        this.dialogRef.close("startSurvey");
    }

    closeQualification() {
        this.dialogRef.close("close");
    }
}