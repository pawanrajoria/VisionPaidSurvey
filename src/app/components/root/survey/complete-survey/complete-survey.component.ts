import { Component } from '@angular/core';
import { RespondentService } from '../respondent.service';
import { RespondentEndSurveyResponseVM, RespondentEndSurveyVM } from '../respondent.vm';
import { HelperService } from '../helper.service';
import { LocalStorageService } from '../../../../localstorage.service';

@Component({
  selector: 'app-complete-survey',
  templateUrl: './complete-survey.component.html',
  styleUrls: ['./complete-survey.component.scss'],
})
export class CompleteSurveyComponent {
  classname: string = "";
  constructor(private respondentService: RespondentService, private helperService: HelperService,
    private localStorageService: LocalStorageService
  ) {
    this.completeSurvey();
  }

  openChat() {

  }

  async completeSurvey() {
    const self = this;
    if (!this.localStorageService.getItem('LandedUrl'))
      return;

    const duid = self.helperService.fetchDuid();
    if (duid == "") {
      window.location.reload();
    }

    let landedUrl: string = this.localStorageService.getItem('LandedUrl') ?? '';
    if (landedUrl.length != window.location.href.length) {
      landedUrl = window.location.href;
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
      window.location.href = ourputUrl.requestUrl;
    }
    else {
      window.location.href = "https://profitpiller.com";
    }
  }
}
