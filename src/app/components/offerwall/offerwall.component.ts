import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../shared.module";
import { OfferwallHeaderComponent } from "./offerwall-header/offerwall-header.component";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-offerwall',
    imports: [RouterOutlet, SharedModule, OfferwallHeaderComponent],
    templateUrl: './offerwall.component.html',
    styleUrls: ['./offerwall.component.scss']
})
export class OfferwallComponent {


}