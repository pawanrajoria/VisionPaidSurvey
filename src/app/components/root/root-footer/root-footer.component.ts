import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";

@Component({
    selector: 'app-root-footer',
    imports: [SharedModule],
    templateUrl: './root-footer.component.html',
    styleUrls: ['./root-footer.component.scss']
})
export class RootFooterComponent implements OnInit {


    ngOnInit(): void {
    }

}