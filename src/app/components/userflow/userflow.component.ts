import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../shared.module";

@Component({
    selector: 'app-userflow',
    imports: [SharedModule],
    templateUrl: './userflow.component.html',
    styleUrls: ['./userflow.component.scss']
})
export class UserflowComponent implements OnInit {

    constructor() {
    }


    async ngOnInit() {
      
    }

}