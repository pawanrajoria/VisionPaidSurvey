import { ChangeDetectorRef, Component, Input, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { QualQuestionVM } from '../../../../../respondent.vm';
import { SharedModule } from '../../../../../../../shared.module';
import { SearchQuestionPipe } from '../../../../../search.pipe';

@Component({
  selector: 'singlepunchquestion',
  templateUrl: './singlepunchquestion.component.html',
  styleUrls: ['./singlepunchquestion.component.scss'],
  imports: [SharedModule,SearchQuestionPipe]
})
export class SinglePunchQuestionComponent implements OnInit {
  @Input() field: QualQuestionVM = new QualQuestionVM;
  @Input() form!: FormGroup;
  get isValid() { return this.form.controls[this.field.qKey].valid; }
  get isDirty() { return this.form.controls[this.field.qKey].dirty; }
  constructor(private readonly changeDetector: ChangeDetectorRef) {


  }

  ngOnInit() {
    if (this.field.qAnswers.findIndex(o => o.isChecked) >= 0)
      this.form.controls[this.field.qKey].setValue(this.field.qAnswers.find(o => o.isChecked)?.preCode);
  }
}
