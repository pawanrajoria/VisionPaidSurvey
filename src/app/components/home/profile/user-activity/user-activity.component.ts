import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { ProfileService } from "../profile.service";
import { IProfileActivityLogVM } from "./user-activity.vm";

@Component({
    selector: 'app-user-activity',
    imports: [SharedModule],
    templateUrl: './user-activity.component.html',
    styleUrls: ['./user-activity.component.scss']
})
export class UserActivityComponent implements OnInit {
    userLogs: Array<IProfileActivityLogVM> = [];

    constructor(private profileService: ProfileService) {
    }

    async ngOnInit() {
        await this.getPointInfo();
    }

    async getPointInfo() {
        const self = this;
        self.userLogs = await self.profileService.getUserActivityInfo();
    }

}