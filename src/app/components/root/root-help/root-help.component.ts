import { Component, OnInit } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";
import { BaseComponent } from "../../../base.component";

@Component({
    selector: 'app-root-help',
    imports: [PublicSharedModule],
    templateUrl: './root-help.component.html',
    styleUrls: ['./root-help.component.scss']
})
export class RootHelpComponent extends BaseComponent implements OnInit {

    constructor() {
        super();
    }


    ngOnInit(): void {
    }
}