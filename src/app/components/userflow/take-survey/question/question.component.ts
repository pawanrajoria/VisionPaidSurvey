import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { LoaderService } from '../../../layout/loader.service';
import { QualQuestionAnswerVM, QualQuestionVM, RespondentSubmitVM } from '../../respondent.vm';
import { QuestionTypeConstant } from '../../const';
import { SessionStorageService } from '../../../../sessionstorage.service';
import { ZipService } from '../../zip.service';
import { SharedModule } from '../../../../shared.module';
import { QuestionRootComponent } from './questionroot/questionroot.component';

@Component({
  selector: 'app-question',
  templateUrl: './question.component.html',
  styleUrls: ['./question.component.scss'],
  imports: [SharedModule, QuestionRootComponent]
})
export class QuestionComponent implements OnChanges {
  @Input() qualification: QualQuestionVM = new QualQuestionVM;
  @Input() country: string = "";
  @Output() submitSurvey = new EventEmitter<RespondentSubmitVM>();

  allDatas: any;
  form!: FormGroup;
  currentPage: number = 1;
  respondentId: number = 0;
  pageCount: number = 0;

  get isValid() {
    if (!!this.qualification) {
      if (this.qualification.qTypeToken == QuestionTypeConstant.MultiPunch) {
        let checkboxCount: number = 0;
        this.qualification.qAnswers?.forEach((f: QualQuestionAnswerVM) => {
          if (this.form.controls[f.key].value) {
            checkboxCount++;
          }
        });
        if (checkboxCount > 0)
          return true;
        else
          return false;
      } else
        return this.form.controls[this.qualification.qKey ?? '']?.valid;
    }
    return false;
  }

  constructor(
    private zipService: ZipService,
    private loaderService: LoaderService,
    private sessionStorageService: SessionStorageService
  ) {
    let fieldsCtrls: any = {};
    this.form = new FormGroup(fieldsCtrls);
    if (!this.sessionStorageService.getItem("pageCount")) {
      this.pageCount = 1;
      this.sessionStorageService.setItem("pageCount", this.pageCount.toString());
    }
    else {
      this.pageCount = parseInt(this.sessionStorageService.getItem("pageCount") ?? "0");
      this.pageCount = this.pageCount + 1;
      this.sessionStorageService.setItem("pageCount", this.pageCount.toString());
    }
  }

  async ngOnChanges() {
    const self = this;
    await self.bindQualification();
  }

  async onSubmit(val: any) {
    // if (this.loaderService.getLoading())
    //   return;

    let answerRequest: RespondentSubmitVM = new RespondentSubmitVM;

    if (this.qualification.qTypeToken == QuestionTypeConstant.MultiPunch) {
      this.qualification.qAnswers.forEach((f: QualQuestionAnswerVM) => {
        if (this.form.controls[f.key].value) {
          answerRequest.preCodes?.push(f.preCode);
        }
      });
    }
    else if (this.qualification.qTypeToken == QuestionTypeConstant.SinglePunch) {
      answerRequest.preCodes?.push(this.form.controls[this.qualification.qKey].value);
    }
    else if (this.qualification.qTypeToken == QuestionTypeConstant.OpenEnd
      || this.qualification.qTypeToken == QuestionTypeConstant.NumberOpenPunch
      || this.qualification.qTypeToken == QuestionTypeConstant.ZipOpenPunch) {
      answerRequest.answerText = this.form.controls[this.qualification.qKey].value;
    }

    answerRequest.qualId = this.qualification.qId;
    answerRequest.qualTypeId = parseInt(this.qualification.qTypeToken);
    answerRequest.surveyQualId = this.qualification.surveyQualId;
    this.submitSurvey.emit(answerRequest);
  }

  private async bindQualification() {
    let fieldsCtrls: any = {};
    const self = this;
    this.qualification.searchingVariable = 'searchingVariable';
    fieldsCtrls["searchingVariable"] = new FormControl("");

    if (this.qualification.qTypeToken == QuestionTypeConstant.MultiPunch) {
      this.qualification.qAnswers?.forEach((f: QualQuestionAnswerVM) => {
        fieldsCtrls[f.key ?? ''] = new FormControl('');
      });
      this.form = new FormGroup(fieldsCtrls);
    }
    else if (this.qualification.qTypeToken == "10") {
      const filterCode = this.zipService.zipCodes.find(p => p.ISO == self.country);
      if (!!filterCode)
        fieldsCtrls[this.qualification.qKey ?? ''] = new FormControl("", [Validators.required, Validators.pattern(filterCode.Regex)]);
      else
        fieldsCtrls[this.qualification.qKey ?? ''] = new FormControl("", Validators.required);

      this.form = new FormGroup(fieldsCtrls);
    }
    else {
      fieldsCtrls[this.qualification.qKey ?? ''] = new FormControl("", Validators.required);
      this.form = new FormGroup(fieldsCtrls);
    }
  }
}
