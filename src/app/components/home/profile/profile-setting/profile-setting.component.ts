import { Component, inject, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { MatDialog } from "@angular/material/dialog";
import { ProfileSettingPopup } from "./profile-setting-popup/profile-setting-popup";

@Component({
    selector: 'app-profile-setting',
    imports: [SharedModule],
    templateUrl: './profile-setting.component.html',
    styleUrls: ['./profile-setting.component.scss']
})
export class ProfileSettingComponent implements OnInit {
    readonly dialog = inject(MatDialog);


    ngOnInit(): void {

    }

    updateUserName() {
        const dialogRef = this.dialog.open(ProfileSettingPopup, {
            data: { title: 'Change User Name', type: 1 }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }


    updateEmail() {
        const dialogRef = this.dialog.open(ProfileSettingPopup, {
            data: { title: 'Change Email', type: 2 }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    updatePassword() {
        const dialogRef = this.dialog.open(ProfileSettingPopup, {
            data: { title: 'Change Password', type: 3 }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    deleteAccount() {
        const dialogRef = this.dialog.open(ProfileSettingPopup, {
            data: { title: 'Delete Account', type: 4 }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }

    updateBasicInfo() {
        const dialogRef = this.dialog.open(ProfileSettingPopup, {
            data: { title: 'Change Basic Info', type: 5 }
        });

        dialogRef.afterClosed().subscribe(result => {
            console.log(`Dialog result: ${result}`);
        });
    }
}