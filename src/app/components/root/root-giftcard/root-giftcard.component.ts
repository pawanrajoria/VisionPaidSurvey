import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { FaqRootComponent } from "../root-faq/root-faq.component";
import { BaseComponent } from "../../../base.component";

@Component({
    selector: 'app-root-giftcard',
    imports: [SharedModule, FaqRootComponent],
    templateUrl: './root-giftcard.component.html',
    styleUrls: ['./root-giftcard.component.scss']
})
export class RootGiftCardComponent extends BaseComponent implements OnInit {

    constructor() {
        super();
    }


    ngOnInit(): void {
    }
}