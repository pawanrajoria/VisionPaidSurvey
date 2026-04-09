import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { ProfileService } from "../profile.service";
import { IProfileActivityLogVM } from "./user-activity.vm";
import { BaseComponent } from "../../../../base.component";

@Component({
    selector: 'app-user-activity',
    imports: [SharedModule],
    templateUrl: './user-activity.component.html',
    styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent extends BaseComponent implements OnInit {
    userLogs: Array<IProfileActivityLogVM> = [];

    constructor(private profileService: ProfileService) {
        super();
    }

    async ngOnInit() {
        await this.getPointInfo();
    }

    async getPointInfo() {
        const self = this;
        self.userLogs = await self.profileService.getUserActivityInfo();
    }

}