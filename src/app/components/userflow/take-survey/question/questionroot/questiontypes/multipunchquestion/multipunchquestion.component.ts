import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { QualQuestionVM } from '../../../../../respondent.vm';
import { SharedModule } from '../../../../../../../shared.module';
import { SearchQuestionPipe } from '../../../../../search.pipe';

@Component({
  selector: 'multipunchquestion',
  templateUrl: './multipunchquestion.component.html',
  styleUrls: ['./multipunchquestion.component.scss'],
  imports: [SharedModule,SearchQuestionPipe]
})
export class MultiPunchQuestionComponent implements OnInit {
  @Input() field: QualQuestionVM = new QualQuestionVM;
  @Input() form!: FormGroup;
  constructor(public builder: FormBuilder) {
  }

  ngOnInit() {
    if (!!this.field && !!this.field.qAnswers && !!this.field.qAnswers.find(o => o.isChecked == true)) {
      const kl: any = this.field.qAnswers.find(o => o.isChecked == true);
      this.form.controls[kl.key].patchValue(true);
    }
  }

  updateAnswer(evt: any) {
  }
}
