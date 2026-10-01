import { Component, inject, OnInit } from "@angular/core";
import { SharedModule } from "../../../../../shared.module";
import { MatDialogRef } from "@angular/material/dialog";

/** What the dialog returns when the user submits. */
export interface ISurveyFeedback {
    action: 'submitForm';
    reason: string;
    comment: string;
}

/** Stored (English) text for each reason, so admins read the same wording in every language. */
export const SURVEY_FEEDBACK_REASONS: Record<string, string> = {
    '1': 'Did not like the survey',
    '2': 'Asked for personal information',
    '3': 'Survey broken / could not continue',
    '4': 'Other'
};

@Component({
    selector: 'app-survey-feedback-popup',
    imports: [SharedModule],
    templateUrl: './survey-feedback-popup.html',
    styleUrls: ['./survey-feedback-popup.scss']
})
export class SurveyFeedBackPopupComponent implements OnInit {
    readonly dialogRef = inject(MatDialogRef<SurveyFeedBackPopupComponent>);
    selectedReason: string = '';
    comment: string = '';

    ngOnInit() {
    }

    submitFeedback() {
        // Nothing chosen and nothing written: treat as a plain close.
        if (!this.selectedReason && !this.comment.trim()) {
            this.dialogRef.close("close");
            return;
        }
        const result: ISurveyFeedback = {
            action: 'submitForm',
            reason: this.selectedReason,
            comment: this.comment.trim().slice(0, 500)
        };
        this.dialogRef.close(result);
    }

    closeHappened() {
        this.dialogRef.close("close");
    }
}
