import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";

@Component({
    selector: 'app-root-aboutus',
    imports: [SharedModule],
    templateUrl: './root-aboutus.component.html',
    styleUrls: ['./root-aboutus.component.scss']
})
export class RootAboutUsComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }
}