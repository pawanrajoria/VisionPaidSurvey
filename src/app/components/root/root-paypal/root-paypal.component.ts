import { Component, OnInit } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";
import { FaqRootComponent } from "../root-faq/root-faq.component";
import { BaseComponent } from "../../../base.component";

@Component({
    selector: 'app-root-paypal',
    imports: [PublicSharedModule, FaqRootComponent],
    templateUrl: './root-paypal.component.html',
    styleUrls: ['./root-paypal.component.scss']
})
export class RootPaypalComponent  extends BaseComponent implements OnInit {

    constructor() {
        super();
    }


    ngOnInit(): void {
    }
}