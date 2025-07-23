import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { FaqRootComponent } from "../root-faq/root-faq.component";

@Component({
    selector: 'app-root-amazongiftcard',
    imports: [SharedModule, FaqRootComponent],
    templateUrl: './root-amazongiftcard.component.html',
    styleUrls: ['./root-amazongiftcard.component.scss']
})
export class RootAmazonGiftCardComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }
}