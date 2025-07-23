import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { IProfileVM, IUserHeading } from "./profile.vm";
import { ProfileService } from "./profile.service";
import { Router } from "@angular/router";
import { AuthService } from "../../auth/auth.service";
import { AccountService } from "../account.service";
import { LocalStorageService } from "../../../localstorage.service";

@Component({
    selector: 'app-profile',
    imports: [SharedModule],
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.scss']
})
export class ProfileComponent implements OnInit {

    userInfo: IProfileVM = { level: "", totalOfferCompleted: "0", totalPointEarned: "0", totalRewardRedeemed: "0", totalSurveyCompleted: "" };
    userHeading: Array<IUserHeading> = [];

    constructor(private profileService: ProfileService, private router: Router,
        public authService: AuthService, private accountService: AccountService,
        private localStorageService: LocalStorageService) {
    }

    async ngOnInit() {
        await this.getProfileInfo();
        await this.bindUserHeading();
    }

    get userBalanceInfo() {
        return this.accountService.getUserBalanceInfo();
    }

    async getProfileInfo() {
        const self = this;
        self.userInfo = await self.profileService.getAccountInfo();
        const gender = !!self.userInfo && self.userInfo.gender == 'Male' ? 1 : !!self.userInfo && self.userInfo.gender == 'Female' ? 2 : !!self.userInfo && self.userInfo.gender == "Other" ? 0 : '';
        this.localStorageService.setItem("userInfo", JSON.stringify({ gender: gender, dateOfBirth: self.userInfo.dateOfBirth, zip: self.userInfo.zip }));
    }

    async bindUserHeading() {
        const self = this;
        self.userHeading = [
            { icon: 'activity', subtitle: 'Activity', title: '' },
            { icon: 'circle-dotted-letter-c', subtitle: 'Points Earned', title: self.userInfo.totalPointEarned.toString() },
            { icon: 'gift', subtitle: 'Rewards Redeemed', title: self.userInfo.totalRewardRedeemed.toString() },
            { icon: 'checkbox', subtitle: 'Survey Completed', title: self.userInfo.totalSurveyCompleted.toString() },
            { icon: 'circle-dashed-check', subtitle: 'Offer Completed', title: self.userInfo.totalOfferCompleted.toString() },
            { icon: 'certificate-2', subtitle: 'Achievements Earned', title: '0' },
            { icon: 'trophy', subtitle: 'Leaderboard Level', title: self.userInfo.level.toString() }
        ]
    }

    async onHeadingClick(heading: IUserHeading) {
        const self = this;
        if (heading.icon === 'gift') {
            self.router.navigate(['/app/account/transactions/0']);
        } else if (heading.icon === 'circle-dotted-letter-c') {
            self.router.navigate(['/app/account/transactions/1']);
        } else if (heading.icon === 'activity') {
            self.router.navigate(['/app/account/activity']);
        } else if (heading.icon === 'checkbox') {
            self.router.navigate(['/app/account/surveyactivity']);
        } else if (heading.icon === 'circle-dashed-check') {
            self.router.navigate(['/app/account/offeractivity']);
        } else if (heading.icon === 'certificate-2') {
            self.router.navigate(['/app/account/achievements']);
        } else if (heading.icon === 'trophy') {
            self.router.navigate(['/app/account/leaderboard']);
        } else {
            self.router.navigate(['/app/account/transactions']);
        }
    }

    getAge(dateOfBirth?: string): number {
        if (!dateOfBirth) {
            return 0; // Return 0 if dateOfBirth is not provided
        }
        const dob = new Date(dateOfBirth);
        const today = new Date();
        let age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
            age--;
        }
        return age;
    }

}