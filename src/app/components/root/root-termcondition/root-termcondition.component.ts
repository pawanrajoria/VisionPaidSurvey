import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";

@Component({
    selector: 'app-root-termcondition',
    imports: [SharedModule],
    templateUrl: './root-termcondition.component.html',
    styleUrls: ['./root-termcondition.component.scss']
})
export class RootTermConditionComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }
}