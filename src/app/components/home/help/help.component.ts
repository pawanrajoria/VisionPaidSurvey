import { Component, OnInit, inject } from "@angular/core";
import { ActivatedRoute } from "@angular/router";
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

    private readonly route = inject(ActivatedRoute);

    ngOnInit(): void {
        // /app/help?ask=1 (the chat's "Raise a query with support") opens the question form straight away.
        if (this.route.snapshot.queryParamMap.get('ask') === '1') this.showAskQuestion = true;
    }

    askQuestion() {
        this.showAskQuestion = true;
    }
}