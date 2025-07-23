import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";

@Component({
    selector: 'app-root-help',
    imports: [SharedModule],
    templateUrl: './root-help.component.html',
    styleUrls: ['./root-help.component.scss']
})
export class RootHelpComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }
}