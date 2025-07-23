import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { FaqRootComponent } from "../root-faq/root-faq.component";
@Component({
    selector: 'app-root-cash',
    imports: [SharedModule, FaqRootComponent],
    templateUrl: './root-cash.component.html',
    styleUrls: ['./root-cash.component.scss']
})
export class RootCashComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }
}