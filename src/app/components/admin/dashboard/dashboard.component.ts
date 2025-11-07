import { Component, OnInit, ViewChild } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { AdminEarningResponseDto } from "../admin.vm";
import { AdminService } from "../admin.service";
import { MatSort } from "@angular/material/sort";

@Component({
    selector: 'app-admindashboard',
    imports: [SharedModule],
    templateUrl: './dashboard.component.html',
    styleUrls: ['./dashboard.component.scss']
})
export class AdminDashboardComponent implements OnInit {
    @ViewChild(MatSort) sort!: MatSort;
    timePeriod: string = 'day';
    selectedTabIndex = 0;
    selectedValueTabIndex = 0;
    adminData: AdminEarningResponseDto = {
        earning: 0,
        totalUsers: 0,
        rejection: 0,
        refrelEarn: 0,
        levelBonusEarn: 0,
        earnings: [],
        withdrawalRequests: [],
        topEarningUsers: [],
        userActivityLog: []
    };

    displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-weight', 'demo-symbol'];
    displayedEarnerColumns: string[] = ['company', 'member', 'amount', 'status', 'earndate', 'completion'];
    displayedActivityLogColumns: string[] = ['member', 'earning', 'rejection', 'earningCount',
        'rejectionCount', 'postbackLogCount', 'activityCount', 'userBalance'];


    get stats() {
        return [
            { id:0,label: "Total Users", value: this.adminData.totalUsers, icon: 'person', change: 3, period: this.timePeriod },
            { id:1,label: "Earning", value: '$' + this.adminData.earning, icon: 'account_balance_wallet', change: 55, period: this.timePeriod },
            { id:2,label: 'Rejection', value: '$' + this.adminData.rejection, icon: 'leaderboard', change: -2, period: this.timePeriod },
            { id:3,label: 'LevelBonusEarn', value: '$' + this.adminData.levelBonusEarn, icon: 'shopping_cart', change: 5, period: this.timePeriod },
            { id:4,label: 'RefrelEarn', value: '$' + this.adminData.refrelEarn, icon: 'shopping_cart', change: 5, period: this.timePeriod },
        ];
    };

    charts = [
        { title: 'Website Views', subtitle: 'Last Campaign Performance', image: 'assets/img/chart1.png', update: 'Campaign sent 2 days ago' },
        { title: 'Daily Sales', subtitle: '(+15%) increase in today sales', image: 'assets/img/chart2.png', update: 'Updated 4 min ago' },
        { title: 'Completed Tasks', subtitle: 'Last Campaign Performance', image: 'assets/img/chart3.png', update: 'Just updated' },
    ];


    projects = [
        {
            logo: 'assets/img/small-logos/logo-xd.svg',
            name: 'Material XD Version',
            members: ['assets/img/team-1.jpg', 'assets/img/team-2.jpg'],
            budget: '$14,000',
            progress: 60,
        },
        {
            logo: 'assets/img/small-logos/logo-atlassian.svg',
            name: 'Add Progress Track',
            members: ['assets/img/team-3.jpg'],
            budget: '$3,000',
            progress: 10,
        },
    ];

    constructor(private adminService: AdminService) {
    }


    async onTabChange(event: any) {
        const mapping = ['day', 'week', 'month', 'year'];
        this.timePeriod = mapping[event.index];
        await this.bindAdminData();
    }

    async ngOnInit() {
        await this.bindAdminData();
    }
    

    async refresh() {
        await this.bindAdminData();
    }

    async bindAdminData() {
        const self = this;

        self.adminData = await self.adminService.getDashboardHistory(this.timePeriod);
        self.adminData.earnings = this.adminData.earnings?.sort((a, b) =>
            new Date(b.earnDate).getTime() - new Date(a.earnDate).getTime()
        );
    }
}