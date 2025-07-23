import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { AskQuestionComponent } from "./ask-question/ask-question.component";

@Component({
    selector: 'app-help',
    imports: [SharedModule, AskQuestionComponent],
    templateUrl: './help.component.html',
    styleUrls: ['./help.component.scss']
})
export class HelpComponent implements OnInit {
    showAskQuestion = false;
    faqs = ['q1', 'q2', 'q3', 'q4', 'q5', 'q6', 'q7', 'q8', 'q9', 'q10'];

    constructor() {

    }

    ngOnInit(): void {
    }

    askQuestion() {
        this.showAskQuestion = true;
    }
}