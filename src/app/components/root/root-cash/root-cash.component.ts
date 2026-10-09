import { Component, OnInit } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";
import { FaqRootComponent } from "../root-faq/root-faq.component";
import { BaseComponent } from "../../../base.component";

@Component({
    selector: 'app-root-cash',
    imports: [PublicSharedModule, FaqRootComponent],
    templateUrl: './root-cash.component.html',
    styleUrls: ['./root-cash.component.scss']
})
export class RootCashComponent extends BaseComponent implements OnInit {

    constructor() {
        super();
    }


    ngOnInit(): void {
    }
}