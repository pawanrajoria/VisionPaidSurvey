import { Component, OnInit } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";

@Component({
    selector: 'app-root-cookiepolicy',
    imports: [PublicSharedModule],
    templateUrl: './root-cookiepolicy.component.html',
    styleUrls: ['./root-cookiepolicy.component.scss']
})
export class RootCookiePolicyComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }

    
}