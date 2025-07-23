import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../shared.module";
import { AdminEarningResponseDto } from "./admin.vm";
import { AdminService } from "./admin.service";

@Component({
    selector: 'app-admin',
    imports: [SharedModule],
    templateUrl: './admin.component.html',
    styleUrls: ['./admin.component.scss']
})
export class AdminComponent {

    
}