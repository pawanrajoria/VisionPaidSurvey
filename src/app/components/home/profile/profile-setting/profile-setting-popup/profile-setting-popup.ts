import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { SharedModule } from "../../../../../shared.module";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProfileSettingDialogData } from "../profile-setting.vm";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProfileService } from "../../profile.service";
import { MessageService } from "../../../../layout/message/message.service";
import { MessageVM } from "../../../../layout/message/message.vm";
import moment from 'moment';
import { LocalStorageService } from "../../../../../localstorage.service";

@Component({
    selector: 'profile-setting-popup',
    imports: [SharedModule],
    templateUrl: 'profile-setting-popup.html',
    styleUrls: ['./profile-setting-popup.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProfileSettingPopup {
    readonly dialogRef = inject(MatDialogRef<ProfileSettingPopup>);
    readonly fb = inject(FormBuilder);
    readonly profileSettingDialogData = inject<ProfileSettingDialogData>(MAT_DIALOG_DATA);

    changeUserNameForm!: FormGroup;
    changeEmailForm!: FormGroup;
    changePasswordForm!: FormGroup;
    deleteAccountForm!: FormGroup;
    changeUserDetailsForm!: FormGroup;

    profileImage: any = "";
    genders = [{ name: 'Male', value: 1 }, { name: 'Female', value: 2 }, { name: 'Other', value: 0 }];

    constructor(private profileService: ProfileService, private messageService: MessageService,
        private localStorageService: LocalStorageService
    ) {
        this.changeUserNameForm = this.fb.group({
            type: 3,
            userName: ['', [Validators.required]],
        });

        this.changeEmailForm = this.fb.group({
            type: 2,
            emailId: ['', [Validators.required, Validators.email]],
            password: ['', [Validators.required]],
        });

        this.changePasswordForm = this.fb.group({
            type: 4,
            password: ['', [Validators.required]],
            newPassword: ['', [Validators.required]],
            confirmNewPassword: ['', [Validators.required]],
        });

        this.deleteAccountForm = this.fb.group({
            password: ['', [Validators.required]],
        });

        const userInfo = !!this.localStorageService.getItem("userInfo") ? JSON.parse(this.localStorageService.getItem("userInfo") || "") : "";

        this.changeUserDetailsForm = this.fb.group({
            dateOfBirth: [!!userInfo ? userInfo.dateOfBirth : '', [Validators.required]],
            gender: [!!userInfo ? userInfo.gender : '', [Validators.required]],
            zip: [!!userInfo ? userInfo.zip : '', [Validators.required]],
            imageUrl: [''],
            phoneNumber: ['']
        });
    }


    async updateUserName() {
        const self = this;
        if (self.changeUserNameForm.invalid)
            return;

        const response = await self.profileService.updateUser(self.changeUserNameForm.value);
        if (!!response && response.isSuccess) {
            self.messageService.showMessage(new MessageVM(response.message, "success"));
            self.dialogRef.close(true);
        }
        else {
            self.messageService.showMessage(new MessageVM(response.message, "error"));
        }
    }

    async updateEmail() {
        const self = this;
        if (self.changeEmailForm.invalid)
            return;

        const response = await self.profileService.updateUser(self.changeEmailForm.value);
        if (!!response && response.isSuccess) {
            self.messageService.showMessage(new MessageVM(response.message, "success"));
            self.dialogRef.close(true);
        }
        else {
            self.messageService.showMessage(new MessageVM(response.message, "error"));
        }
    }

    async updatePassword() {
        const self = this;
        if (self.changePasswordForm.invalid)
            return;

        const response = await self.profileService.updateUser(self.changePasswordForm.value);
        if (!!response && response.isSuccess) {
            self.messageService.showMessage(new MessageVM(response.message, "success"));
            self.dialogRef.close(true);
        }
        else {
            self.messageService.showMessage(new MessageVM(response.message, "error"));
        }
    }

    async deleteAccount() {
        const self = this;
        if (self.deleteAccountForm.invalid)
            return;

        const response = await self.profileService.deleteUser(self.deleteAccountForm.value);
        if (!!response && response.isSuccess) {
            self.messageService.showMessage(new MessageVM(response.message, "success"));
            self.dialogRef.close(true);
        }
        else {
            self.messageService.showMessage(new MessageVM(response.message, "error"));
        }
    }

    async updateUserDetails() {
        const self = this;
        if (self.changeUserDetailsForm.invalid)
            return;

        const response = await self.profileService.updateUserDetails(self.changeUserDetailsForm.value);
        if (!!response && response.isSuccess) {
            self.messageService.showMessage(new MessageVM(response.message, "success"));
            this.localStorageService.setItem("userInfo", JSON.stringify(self.changeUserDetailsForm.value));
            self.dialogRef.close(true);
        }
        else {
            self.messageService.showMessage(new MessageVM(response.message, "error"));
        }
    }

    onFileSelected(event: Event) {
        const file = (event.target as HTMLInputElement).files?.[0];
        if (file) {
            this.changeUserDetailsForm.patchValue({ imageUrl: file });
            const reader = new FileReader();
            reader.onload = () => {
                this.profileImage = reader.result;
            };
            reader.readAsDataURL(file);
        }
    }

}