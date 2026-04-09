import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { ProfileService } from "../profile.service";
import { IUserActivityVM } from "../profile.vm";
import { BaseComponent } from "../../../../base.component";

@Component({
    selector: 'app-survey-activity',
    imports: [SharedModule],
    templateUrl: './survey-activity.component.html',
    styleUrls: ['./survey-activity.component.scss']
})
export class SurveyActivityComponent extends BaseComponent implements OnInit {
    surveyData: Array<IUserActivityVM> = [];

    constructor(private profileService: ProfileService) {
        super();
    }

    async ngOnInit() {
        await this.getSurveyInfo();
    }

    async getSurveyInfo() {
        const self = this;
        self.surveyData = await self.profileService.getSurveyActivityInfo();
        if (!!self.surveyData)
            self.surveyData.sort((a, b) => new Date(b.attemptDate).getTime() - new Date(a.attemptDate).getTime());
    }
}