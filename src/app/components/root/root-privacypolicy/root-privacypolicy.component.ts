import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";

@Component({
    selector: 'app-root-privacypolicy',
    imports: [SharedModule],
    templateUrl: './root-privacypolicy.component.html',
    styleUrls: ['./root-privacypolicy.component.scss']
})
export class RootPrivacyPolicyComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }
}