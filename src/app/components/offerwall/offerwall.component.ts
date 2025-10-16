import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../shared.module";
import { OfferwallHeaderComponent } from "./offerwall-header/offerwall-header.component";

@Component({
    selector: 'app-offerwall',
    imports: [SharedModule, OfferwallHeaderComponent],
    templateUrl: './offerwall.component.html',
    styleUrls: ['./offerwall.component.scss']
})
export class OfferwallComponent {


}