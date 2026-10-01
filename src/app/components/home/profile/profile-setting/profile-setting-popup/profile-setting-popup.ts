import { ChangeDetectionStrategy, Component, inject } from "@angular/core";
import { SharedModule } from "../../../../../shared.module";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { ProfileSettingDialogData } from "../profile-setting.vm";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { ProfileService } from "../../profile.service";
import { MessageService } from "../../../../layout/message/message.service";
import { MessageVM } from "../../../../layout/message/message.vm";
import moment from 'moment';
import { TranslateService } from "@ngx-translate/core";
import { LocalStorageService } from "../../../../../localstorage.service";
import { EngagementService } from "../../../engagement/engagement.service";
import { USER_TIME_ZONE_KEY, allTimeZones, browserTimeZone, zoneLabel, zonesForCountry } from "../../../../../timezones";

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
    private readonly translate = inject(TranslateService);
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

        // Accounts created with Google / Apple / Facebook have no password yet, so there is
        // no "current password" to ask for. The API already accepts that; the form used to
        // make it impossible by marking the field required.
        if (!this.hasPassword) {
            for (const form of [this.changeEmailForm, this.changePasswordForm, this.deleteAccountForm]) {
                form.get('password')?.clearValidators();
                form.get('password')?.updateValueAndValidity();
            }
        }

        const data = this.profileSettingDialogData;
        this.countryZones = zonesForCountry(data.countryCode);
        this.otherZones = allTimeZones().filter(z => !this.countryZones.includes(z));
        this.selectedZone = data.timeZone ?? '';
    }

    /** False for social-login accounts that never set a password. */
    get hasPassword(): boolean {
        return this.profileSettingDialogData.hasPassword !== false;
    }

    // ───────────── Time zone ─────────────
    countryZones: string[] = [];
    otherZones: string[] = [];
    /** '' = automatic (use the browser's zone). */
    selectedZone = '';
    readonly browserZone = browserTimeZone();
    readonly zoneLabel = zoneLabel;
    private readonly engagement = inject(EngagementService);

    async saveTimeZone() {
        const zone = this.selectedZone || null;
        const response = await this.engagement.setTimeZone(zone);
        if (!!response && response.isSuccess) {
            if (zone) this.localStorageService.setItem(USER_TIME_ZONE_KEY, zone);
            else this.localStorageService.removeItem(USER_TIME_ZONE_KEY);
            this.messageService.showMessage(new MessageVM(response.message, "success"));
            this.dialogRef.close('timezone');
        }
        else {
            this.messageService.showMessage(new MessageVM(response?.message ?? 'Time zone could not be saved.', "error"));
        }
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

        const { newPassword, confirmNewPassword } = self.changePasswordForm.value;
        if ((newPassword ?? '').length < 6) {
            self.messageService.showMessage(new MessageVM(self.translate.instant('app.settings.passwordShort'), "error"));
            return;
        }
        // The confirmation field existed but was never compared.
        if (newPassword !== confirmNewPassword) {
            self.messageService.showMessage(new MessageVM(self.translate.instant('app.settings.passwordMismatch'), "error"));
            return;
        }

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