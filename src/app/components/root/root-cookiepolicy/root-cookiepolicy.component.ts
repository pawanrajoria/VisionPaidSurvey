import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";

@Component({
    selector: 'app-root-cookiepolicy',
    imports: [SharedModule],
    templateUrl: './root-cookiepolicy.component.html',
    styleUrls: ['./root-cookiepolicy.component.scss']
})
export class RootCookiePolicyComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }

    
}