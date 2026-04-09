import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { ProfileService } from "../profile.service";
import { IProfileActivityEarningVM } from "./point-activity.vm";
import { ActivatedRoute } from "@angular/router";
import { BaseComponent } from "../../../../base.component";

@Component({
    selector: 'app-point-activity',
    imports: [SharedModule],
    templateUrl: './point-activity.component.html',
    styleUrls: ['./point-activity.component.scss']
})
export class PointActivityComponent extends BaseComponent implements OnInit {
    pointTransactionInfo!: IProfileActivityEarningVM;
    selectedIndex = 0;

    constructor(private profileService: ProfileService, private route: ActivatedRoute,
    ) {
        super();
        this.route.paramMap.subscribe(params => {
            this.selectedIndex = Number(params.get('id') || 1);
        });
    }

    async ngOnInit() {
        await this.getPointInfo();
    }

    async getPointInfo() {
        const self = this;
        self.pointTransactionInfo = await self.profileService.getPointInfo();
        if (!!self.pointTransactionInfo) {
            if (!!self.pointTransactionInfo.earnings)
                self.pointTransactionInfo.earnings.sort((a, b) => new Date(b.earnDate).getTime() - new Date(a.earnDate).getTime());

            if (!!self.pointTransactionInfo.pendingEarnings)
                self.pointTransactionInfo.pendingEarnings.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());

            if (!!self.pointTransactionInfo.payoutRequests)
                self.pointTransactionInfo.payoutRequests.sort((a, b) => new Date(b.requestDate).getTime() - new Date(a.requestDate).getTime());
        }
    }

}