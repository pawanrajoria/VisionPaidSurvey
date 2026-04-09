import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { FaqRootComponent } from "../root-faq/root-faq.component";
import { BaseComponent } from "../../../base.component";

@Component({
    selector: 'app-root-visa',
    imports: [SharedModule, FaqRootComponent],
    templateUrl: './root-visa.component.html',
    styleUrls: ['./root-visa.component.scss']
})
export class RootVisaComponent extends BaseComponent implements OnInit {

    constructor() {
        super();
    }


    ngOnInit(): void {
    }
}