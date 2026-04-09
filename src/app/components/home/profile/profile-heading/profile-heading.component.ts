import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { BaseComponent } from "../../../../base.component";

@Component({
    selector: 'app-profile-heading',
    imports: [SharedModule],
    templateUrl: './profile-heading.component.html',
    styleUrls: ['./profile-heading.component.scss']
})
export class ProfileHeadingComponent extends BaseComponent implements OnInit {
    headingData: Array<any> = [];

    constructor() {
        super();
    }

    ngOnInit(): void {
    }
}