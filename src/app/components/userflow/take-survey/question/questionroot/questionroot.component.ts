import { Component, Input, OnInit } from '@angular/core';
import { SharedModule } from '../../../../../shared.module';
import { QuestionBuilderComponent } from './questionhelpers/questionbuilder.component';

@Component({
  selector: 'app-questionroot',
  templateUrl: './questionroot.component.html',
  styleUrls: ['./questionroot.component.scss'],
  imports: [SharedModule,QuestionBuilderComponent]
})
export class QuestionRootComponent implements OnInit {
  @Input() field: any;
  @Input() form: any;

  ngOnInit(): void {

  }
}
