import { Component, OnInit } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";

@Component({
    selector: 'app-root-aboutus',
    imports: [PublicSharedModule],
    templateUrl: './root-aboutus.component.html',
    styleUrls: ['./root-aboutus.component.scss']
})
export class RootAboutUsComponent implements OnInit {

    constructor() {
    }


    ngOnInit(): void {
    }
}