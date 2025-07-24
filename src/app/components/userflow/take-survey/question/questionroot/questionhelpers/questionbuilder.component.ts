import { Component, Input, OnChanges, OnInit, SimpleChanges, ViewContainerRef, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { QuestionRootDirective } from './question-directive/question.directive';
import { QualQuestionAnswerVM, QualQuestionVM } from '../../../../respondent.vm';
import { questionTypeComponents, QuestionTypeConstant } from '../../../../const';
import { ZipService } from '../../../../zip.service';
import { SharedModule } from '../../../../../../shared.module';
import { SessionStorageService } from '../../../../../../sessionstorage.service';

@Component({
  selector: 'question-builder',
  templateUrl: './questionbuilder.component.html',
  imports: [QuestionRootDirective, SharedModule]
})
export class QuestionBuilderComponent implements OnInit, OnChanges {
  @Input() field!: QualQuestionVM;
  @Input() form: any;
  @ViewChild(QuestionRootDirective, { static: true })
  questionRoot!: QuestionRootDirective;

  constructor(private zipService: ZipService, private componentFactoryResolver: ComponentFactoryResolver,
    private sessionStorageService: SessionStorageService
  ) {
  }



  loadComponent() {
    const component: any = questionTypeComponents.find(p => p.questionTypeId == this.field.qTypeToken);
    const factory = this.componentFactoryResolver.resolveComponentFactory(component.componentName);

    const viewContainerRef = this.questionRoot.viewContainerRef;
    viewContainerRef.clear();
    const compRef: any = viewContainerRef.createComponent(factory);
    compRef.instance.field = this.field;
    compRef.instance.form = this.form;
  }
  get isValid() {
    if (!!this.field) {
      if (this.field.qTypeToken == QuestionTypeConstant.MultiPunch) {
        let checkboxCount: number = 0;
        this.field.qAnswers?.forEach((f: QualQuestionAnswerVM) => {
          if (this.form.controls[f.key].value) {
            checkboxCount++;
          }
        });
        if (checkboxCount > 0)
          return true;
      } else
        return this.form.controls[this.field.qKey]?.valid;
    }
  }

  get isDirty() {
    if (!!this.field) {
      if (this.field.qTypeToken == QuestionTypeConstant.MultiPunch) {
        let checkboxCount: number = 0;
        this.field.qAnswers?.forEach((f: QualQuestionAnswerVM) => {
          if (this.form.controls[f.key].value) {
            checkboxCount++;
          }
        });
        if (checkboxCount < 1)
          return false;
      } else
        return (!!this.form.controls[this.field.qKey]?.errors?.required ? true : false);
    }
    return false;
  }

  get isPatternError() {
    if (!!this.field) {
      if (this.field.qTypeToken == QuestionTypeConstant.OpenEnd
        || this.field.qTypeToken == QuestionTypeConstant.NumberOpenPunch
        || this.field.qTypeToken == QuestionTypeConstant.ZipOpenPunch
      ) {
        return (this.form.controls[this.field.qKey]?.errors?.pattern) ?? false;
      }
    }

    return false;
  }

  get zipErrorMessage() {
    const languageId: any = this.sessionStorageService.getItem("languageId");
    if (!!languageId) {
      const filterData = this.zipService.zipCodes.find(o => o.LanguageId == languageId);
      if (!!filterData)
        return filterData.ErrorMessage;
    }

    return "Please provide valid zip code.";
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (!!this.field)
      this.loadComponent();
  }

  async ngOnInit() {
  }
}
