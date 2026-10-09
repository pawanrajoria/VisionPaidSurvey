import { Component, inject, ViewChild } from '@angular/core';
import { MatDrawer } from '@angular/material/sidenav';
import {
  QualQuestionVM,
  RespondentEntryRequestVM,
  RespondentEntryResponseVM,
  RespondentSubmitVM
} from '../respondent.vm';
import { RespondentService } from '../respondent.service';
import { LocalStorageService } from '../../../localstorage.service';
import { HelperService } from '../helper.service';
import { SharedModule } from '../../../shared.module';
import { QuestionComponent } from './question/question.component';
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { Iso639Map } from '../../../supporteslanguage';
import { BaseSurveyComponent } from '../../../base.survey.component';

@Component({
  selector: 'app-take-survey',
  standalone: true,
  templateUrl: './take-survey.component.html',
  styleUrls: ['./take-survey.component.scss'],
  imports: [SharedModule, QuestionComponent]
})
export class TakeSurveyComponent extends BaseSurveyComponent {
  @ViewChild('drawer') public drawer?: MatDrawer;

  dialogRef = inject(MatDialogRef<TakeSurveyComponent>, { optional: true });
  private dialogData = inject(MAT_DIALOG_DATA, { optional: true });

  // Exposes whether this component is running in a popup or as a full page
  get isDialog(): boolean {
    return !!this.dialogRef;
  }

  classname: string = '';
  country: string = '';
  respondentData: RespondentEntryResponseVM = new RespondentEntryResponseVM();
  qualification: QualQuestionVM = new QualQuestionVM();
  qualificationIndex: number = 0;

  constructor(
    private respondentService: RespondentService,
    private localStorageService: LocalStorageService,
    private helperService: HelperService
  ) {
    super(); // bind win, nav, doc, isBrowser
    if (this.isBrowser) {
      this.getSurvey();
    }
  }

  detectBrowser(): string {
    if (!this.nav) return 'Unknown';

    const userAgent = this.nav.userAgent;
    if (userAgent.indexOf('Edg') > -1) return 'Microsoft Edge';
    if (userAgent.indexOf('Chrome') > -1) return 'Chrome';
    if (userAgent.indexOf('Firefox') > -1) return 'Firefox';
    if (userAgent.indexOf('Safari') > -1) return 'Safari';
    if (userAgent.indexOf('Opera') > -1) return 'Opera';
    if (userAgent.indexOf('Trident') > -1 || userAgent.indexOf('MSIE') > -1) return 'Internet Explorer';

    return 'Unknown';
  }

  getLang3(lang: string): string {
    const lang2 = lang.split('-')[0].toLowerCase();
    return Iso639Map[lang2] || "eng";
  }

  async getSurvey(): Promise<void> {
    const duid = await this.helperService.getOrInitializeDuid();

    let landedUrl: string = this.localStorageService.getItem('LandedUrl') || '';
    if (this.win && landedUrl.length !== this.win.location.href.length) {
      landedUrl = this.win.location.href;
    }

    if (this.dialogData) {
      landedUrl = this.dialogData.landedUrl;
    }

    const request: RespondentEntryRequestVM = {
      requestUrl: landedUrl,
      duid: duid ?? '',
      browser: this.detectBrowser(),
      refredUrl: this.doc?.referrer || '',
      languageCode: this.isBrowser ? this.getLang3(navigator.language) : 'eng'
    };

    let entry: RespondentEntryResponseVM | null = null;
    try {
      entry = await this.respondentService.enterRespondent(request);
    } catch {
      entry = null;
    }

    if (
      !!entry &&
      !entry.isFailed &&
      !entry.redirectUrl &&
      !!entry.qualifications &&
      entry.qualifications.length > 0
    ) {
      this.respondentData = entry;
      this.respondentData.qualifications = entry.qualifications.sort((a, b) =>
        a.orderId < b.orderId ? -1 : 1
      );
      this.qualification = this.respondentData.qualifications[this.qualificationIndex];
    } else {
      if (entry) this.respondentData = entry;
      this.leave(entry);
    }
  }

  /**
   * Ends the screener. Every outcome is handled, including a failed request and a response
   * with neither flag set - those used to leave the dialog open and blank, or (worse) sent the
   * whole app to the marketing site from inside a dialog.
   */
  private leave(response: RespondentEntryResponseVM | null): void {
    const redirect = response?.redirectUrl || '';

    if (this.dialogRef) {
      const qualified = !!response && !response.isFailed && (response.isQualified || !!redirect);
      this.dialogRef.close({ role: qualified ? 'qualify' : 'disquality', data: redirect });
      return;
    }

    if (this.win) this.win.location.href = redirect || this.win.location.origin;
  }

  async submitSurvey(answerRequest: RespondentSubmitVM): Promise<void> {
    answerRequest.respondentToken = this.respondentData.respondentToken;
    answerRequest.isLast = false;

    if (this.qualificationIndex + 1 === this.respondentData.qualifications?.length) {
      answerRequest.isLast = true;
    }

    let response: RespondentEntryResponseVM | null = null;
    try {
      response = await this.respondentService.submitRespondent(answerRequest);
    } catch {
      response = null;
    }

    if (!!response && !response.isFailed && !response.redirectUrl) {
      this.qualificationIndex++;
      if (
        !!this.respondentData.qualifications &&
        this.respondentData.qualifications.length > this.qualificationIndex
      ) {
        this.qualification = this.respondentData.qualifications[this.qualificationIndex];
      }
    } else {
      this.leave(response);
    }
  }

  openChat(): void {
    // Implementation for chat popup if needed
  }
}