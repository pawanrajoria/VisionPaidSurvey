import { Component, Input } from "@angular/core";
import { SharedModule } from "../../../../shared.module";

@Component({
    selector: 'app-empty-skelten',
    imports: [SharedModule],
    templateUrl: './empty-skelten.component.html',
    styleUrls: ['./empty-skelten.component.scss']
})
export class EmptySkeltenComponent {

    @Input() hasData: boolean = false;
    skeletonCards: any[] = [];

    constructor() {
        this.skeletonCards = Array(21).fill({
            class: 'survey-card-skeleton'
        });
    }
}