import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared.module";

@Component({
    selector: 'app-profile-heading',
    imports: [SharedModule],
    templateUrl: './profile-heading.component.html',
    styleUrls: ['./profile-heading.component.scss']
})
export class ProfileHeadingComponent implements OnInit {
    headingData: Array<any> = [];

    ngOnInit(): void {
    }
}