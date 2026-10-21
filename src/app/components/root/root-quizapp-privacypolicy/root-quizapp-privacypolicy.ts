import { Component, OnInit } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";

@Component({
    selector: 'app-root-quizapp-privacypolicy',
    imports: [PublicSharedModule],
    templateUrl: './root-quizapp-privacypolicy.html',
    styleUrls: ['./root-quizapp-privacypolicy.scss']
})
export class RootQuizAppPrivacyPolicyComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }
}