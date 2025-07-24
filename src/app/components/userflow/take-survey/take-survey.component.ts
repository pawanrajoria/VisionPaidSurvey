import { Component, ViewChild } from '@angular/core';
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
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-take-survey',
  standalone: true,
  templateUrl: './take-survey.component.html',
  styleUrls: ['./take-survey.component.scss'],
  imports: [SharedModule, QuestionComponent]
})
export class TakeSurveyComponent extends BaseComponent {
  @ViewChild('drawer') public drawer?: MatDrawer;

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

  async getSurvey(): Promise<void> {
    const duid = this.helperService.fetchDuid();
    if (!duid && this.win) {
      this.win.location.reload();
      return;
    }

    let landedUrl: string = this.localStorageService.getItem('LandedUrl') || '';
    if (this.win && landedUrl.length !== this.win.location.href.length) {
      landedUrl = this.win.location.href;
    }

    const request: RespondentEntryRequestVM = {
      requestUrl: landedUrl,
      duid: duid,
      browser: this.detectBrowser(),
      refredUrl: this.doc?.referrer || ''
    };

    this.respondentData = await this.respondentService.enterRespondent(request);

    if (
      !!this.respondentData &&
      !this.respondentData.isFailed &&
      !this.respondentData.redirectUrl &&
      !!this.respondentData.qualifications
    ) {
      this.respondentData.qualifications = this.respondentData.qualifications.sort((a, b) =>
        a.orderId < b.orderId ? -1 : 1
      );
      this.qualification = this.respondentData.qualifications[this.qualificationIndex];
    } else {
      const redirect = this.respondentData?.redirectUrl || 'https://profitpiller.com';
      if (this.win) this.win.location.href = redirect;
    }
  }

  async submitSurvey(answerRequest: RespondentSubmitVM): Promise<void> {
    answerRequest.respondentToken = this.respondentData.respondentToken;
    answerRequest.isLast = false;

    if (this.qualificationIndex + 1 === this.respondentData.qualifications?.length) {
      answerRequest.isLast = true;
    }

    const response = await this.respondentService.submitRespondent(answerRequest);

    if (!!response && !response.isFailed && !response.redirectUrl) {
      this.qualificationIndex++;
      if (
        !!this.respondentData.qualifications &&
        this.respondentData.qualifications.length > this.qualificationIndex
      ) {
        this.qualification = this.respondentData.qualifications[this.qualificationIndex];
      }
    } else {
      const redirect = response?.redirectUrl || 'https://profitpiller.com';
      if (this.win) this.win.location.href = redirect;
    }
  }

  openChat(): void {
    // Implementation for chat popup if needed
  }
}
