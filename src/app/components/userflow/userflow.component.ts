import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../shared.module";
import { RouterOutlet } from "@angular/router";

@Component({
    selector: 'app-userflow',
    imports: [RouterOutlet,SharedModule],
    templateUrl: './userflow.component.html',
    styleUrls: ['./userflow.component.scss']
})
export class UserflowComponent implements OnInit {

    constructor() {
    }


    async ngOnInit() {
      
    }

}