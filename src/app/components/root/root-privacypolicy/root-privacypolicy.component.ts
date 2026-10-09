import { Component, OnInit } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";

@Component({
    selector: 'app-root-privacypolicy',
    imports: [PublicSharedModule],
    templateUrl: './root-privacypolicy.component.html',
    styleUrls: ['./root-privacypolicy.component.scss']
})
export class RootPrivacyPolicyComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }
}