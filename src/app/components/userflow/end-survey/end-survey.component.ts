import { Component, OnInit } from '@angular/core';
import { RespondentService } from '../respondent.service';
import { RespondentEndSurveyResponseVM, RespondentEndSurveyVM } from '../respondent.vm';
import { HelperService } from '../helper.service';
import { LocalStorageService } from '../../../localstorage.service';
import { BaseComponent } from '../../../base.component';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../shared.module';

@Component({
  selector: 'app-end-survey',
  templateUrl: './end-survey.component.html',
  styleUrls: ['./end-survey.component.scss'],
  imports: [SharedModule]
})
export class EndSurveyComponent extends BaseComponent {
  classname: string = "";
  isLoading: boolean = true;
  constructor(private respondentService: RespondentService, private helperService: HelperService,
    private localStorageService: LocalStorageService, private route: ActivatedRoute
  ) {
    super();
    this.endSurvey();
  }

  openChat() {

  }

  decodeMessageId(encoded: string): string {
    try {
      return atob(encoded);
    } catch (e) {
      // console.error("Invalid Base64");
      return '';
    }
  }

  handleCpxMessage(encoded: string) {
    const decoded = this.decodeMessageId(encoded);
    const code = Number(decoded);
    return code;
  }

  async endSurvey() {
    const self = this;

    const token = this.route.snapshot.queryParamMap.get('Token');
    const statusId = this.route.snapshot.queryParamMap.get('StatusId');
    const transactionId = this.route.snapshot.queryParamMap.get('transid');
    self.isLoading = true;
    // const statusCode = this.handleCpxMessage(statusId || "");

    // const transData = await self.respondentService.callCPXSurveyResponseApi(transactionId);
    // debugger;
    // A failed status lookup used to leave the visitor on "Waiting for response..." forever.
    let ourputUrl: RespondentEndSurveyResponseVM | null = null;
    try {
      ourputUrl = await self.respondentService.endRespondent(token, transactionId, statusId);
    } catch {
      ourputUrl = null;
    }

    if (this.win) {
      this.win.location.href = ourputUrl?.requestUrl || this.win.location.origin;
    }

    self.isLoading = false;
  }
}
