import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { FaqRootComponent } from "../root-faq/root-faq.component";

@Component({
    selector: 'app-root-visa',
    imports: [SharedModule, FaqRootComponent],
    templateUrl: './root-visa.component.html',
    styleUrls: ['./root-visa.component.scss']
})
export class RootVisaComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }
}