import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { IUserActivityVM } from "../profile.vm";
import { ProfileService } from "../profile.service";
import { BaseComponent } from "../../../../base.component";

@Component({
    selector: 'app-offer-activity',
    imports: [SharedModule],
    templateUrl: './offer-activity.component.html',
    styleUrls: ['./offer-activity.component.scss']
})
export class OfferActivityComponent extends BaseComponent implements OnInit {
    offerData: Array<IUserActivityVM> = [];

    constructor(private profileService: ProfileService) {
        super();
    }

    async ngOnInit() {
        await this.getOfferInfo();
    }

    async getOfferInfo() {
        const self = this;
        self.offerData = await self.profileService.getOfferActivityInfo();
        if (!!self.offerData)
            self.offerData.sort((a, b) => new Date(b.attemptDate).getTime() - new Date(a.attemptDate).getTime());
    }
}