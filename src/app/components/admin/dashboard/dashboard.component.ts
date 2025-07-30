import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { AdminEarningResponseDto } from "../admin.vm";
import { AdminService } from "../admin.service";

@Component({
    selector: 'app-admindashboard',
    imports: [SharedModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
    adminData: AdminEarningResponseDto = {
        totalEarning: 0,
        todayEarning: 0,
        totalUsers: 0,
        totalRejection: 0,
        totalWithdrawalAmount: 0,
        totalRefrelEarn: 0,
        totalLevelBonusEarn: 0,
        earning: [],
        withdrawalRequests: [],
        topEarningUsers: []
    };
    displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-weight', 'demo-symbol'];
    displayedEarnerColumns: string[] = ['demo-name', 'demo-weight'];

    constructor(private adminService: AdminService) {
    }

    async ngOnInit() {
        await this.bindAdminData();
    }

    async refresh() {
        await this.bindAdminData();
    }

    async bindAdminData() {
        const self = this;

        self.adminData = await self.adminService.getDashboardHistory();
        self.adminData.earning = this.adminData.earning?.sort((a, b) =>
            new Date(b.earnDate).getTime() - new Date(a.earnDate).getTime()
        );
    }
}