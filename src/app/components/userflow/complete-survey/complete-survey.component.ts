import { Component } from '@angular/core';
import { RespondentService } from '../respondent.service';
import { RespondentEndSurveyResponseVM, RespondentEndSurveyVM } from '../respondent.vm';
import { HelperService } from '../helper.service';
import { LocalStorageService } from '../../../localstorage.service';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-complete-survey',
  templateUrl: './complete-survey.component.html',
  styleUrls: ['./complete-survey.component.scss'],
})
export class CompleteSurveyComponent extends BaseComponent {
  classname: string = "";
  constructor(private respondentService: RespondentService, private helperService: HelperService,
    private localStorageService: LocalStorageService
  ) {
    super();
    this.completeSurvey();
  }

  openChat() {

  }

  async completeSurvey() {
    const self = this;
    if (!this.localStorageService.getItem('LandedUrl'))
      return;

    const duid = self.helperService.fetchDuid();
    if (duid == "" && this.win) {
      this.win.location.reload();
    }

    let landedUrl: string = this.localStorageService.getItem('LandedUrl') ?? '';
    if (!!this.win && landedUrl.length != this.win.location.href.length) {
      landedUrl = this.win.location.href;
    }


    const request: RespondentEndSurveyVM = {
      requestUrl: landedUrl,
      duid: duid,
    };

    if (request.requestUrl.indexOf("/") >= 0) {
      request.requestUrl = request.requestUrl.replace("/#/", "/");
    }

    const ourputUrl: RespondentEndSurveyResponseVM = await self.respondentService.completeRespondent(request);
    if (!!ourputUrl && !!ourputUrl.requestUrl) {
      if (this.win) {
        this.win.location.href = ourputUrl.requestUrl;
      }
    }
    else {
      if (this.win) {
        this.win.location.href = "https://profitpiller.com";
      }
    }
  }
}
