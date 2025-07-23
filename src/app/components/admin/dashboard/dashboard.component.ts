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
    adminData!: AdminEarningResponseDto;
    displayedColumns: string[] = ['demo-position', 'demo-name', 'demo-weight', 'demo-symbol'];
    
    constructor(private adminService: AdminService) {
    }

    async ngOnInit() {
        await this.bindAdminData();
    }

    async refresh(){
        await this.bindAdminData();
    }

    async bindAdminData() {
        const self = this;

        self.adminData = await self.adminService.getDashboardHistory();
    }
}