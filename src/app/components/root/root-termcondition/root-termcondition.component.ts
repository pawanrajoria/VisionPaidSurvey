import { Component, OnInit } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";

@Component({
    selector: 'app-root-termcondition',
    imports: [PublicSharedModule],
    templateUrl: './root-termcondition.component.html',
    styleUrls: ['./root-termcondition.component.scss']
})
export class RootTermConditionComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }
}