import { Component, Input } from '@angular/core';
import { QualQuestionVM } from '../../../../../respondent.vm';
import { QuestionTypeConstant } from '../../../../../const';
import { SharedModule } from '../../../../../../../shared.module';

@Component({
  selector: 'textquestion',
  templateUrl: './textquestion.component.html',
  imports: [SharedModule]
})
export class TextQuestionComponent {
  @Input() field: QualQuestionVM = new QualQuestionVM;
  @Input() form: any;
  get isValid() { return this.form.controls[this.field.qKey].valid; }
  get isDirty() { return this.form.controls[this.field.qKey].dirty; }

  constructor() {
  }

  checkcharacter(event: any, questionSubType?: string) {
    if (this.field.qTypeToken == QuestionTypeConstant.NumberOpenPunch) {
      const pattern = /[0-9]/;
      if (!pattern.test(event.key) || event.target.value.length > 2) {
        event.preventDefault();
      }
    }
  }
}
