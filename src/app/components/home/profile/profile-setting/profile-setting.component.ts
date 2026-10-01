import { Component, inject, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { MatDialog } from "@angular/material/dialog";
import { ProfileSettingPopup } from "./profile-setting-popup/profile-setting-popup";
import { BaseComponent } from "../../../../base.component";
import { EngagementService } from "../../engagement/engagement.service";
import { IUserSettings } from "../../engagement/engagement.vm";
import { browserTimeZone, zoneLabel } from "../../../../timezones";
import { TranslateService } from "@ngx-translate/core";

const PROVIDER_NAMES: Record<string, string> = {
    'password': 'app.settings.emailPassword',
    'google.com': 'Google',
    'apple.com': 'Apple',
    'facebook.com': 'Facebook'
};

@Component({
    selector: 'app-profile-setting',
    imports: [SharedModule],
    templateUrl: './profile-setting.component.html',
    styleUrls: ['./profile-setting.component.scss']
})
export class ProfileSettingComponent extends BaseComponent implements OnInit {

    readonly dialog = inject(MatDialog);
    private readonly translate = inject(TranslateService);
    private readonly engagement = inject(EngagementService);

    /** Time zone, sign-in provider(s) and whether the account has a password. */
    settings: IUserSettings | null = null;

    constructor() {
        super();
    }

    async ngOnInit() {
        this.settings = await this.engagement.getSettings();
    }

    get signedInWith(): string {
        const providers = this.settings?.loginProviders?.length ? this.settings.loginProviders : [this.settings?.lastLoginProvider ?? ''];
        return providers.filter(p => !!p).map(p => p === 'password' ? this.translate.instant(PROVIDER_NAMES[p]) : (PROVIDER_NAMES[p] ?? p)).join(', ');
    }

    get timeZoneText(): string {
        const zone = this.settings?.timeZone;
        return zone ? zoneLabel(zone) : `${this.translate.instant('app.settings.automatic')} · ${zoneLabel(browserTimeZone())}`;
    }

    /** Extra dialog data every popup gets, so it knows whether to ask for a current password. */
    private get common() {
        return {
            hasPassword: this.settings?.hasPassword ?? true,
            countryCode: this.settings?.countryCode ?? '',
            timeZone: this.settings?.timeZone ?? null
        };
    }

    updateUserName() {
        this.dialog.open(ProfileSettingPopup, {
            data: { title: 'Change User Name', type: 1, ...this.common }
        });
    }

    updateEmail() {
        this.dialog.open(ProfileSettingPopup, {
            data: { title: 'Change Email', type: 2, ...this.common }
        });
    }

    updatePassword() {
        const dialogRef = this.dialog.open(ProfileSettingPopup, {
            data: { title: this.common.hasPassword ? 'Change Password' : 'Set a Password', type: 3, ...this.common }
        });

        dialogRef.afterClosed().subscribe(async result => {
            // After a social-login account sets its first password, the next visit must ask for it.
            if (result) this.settings = await this.engagement.getSettings();
        });
    }

    deleteAccount() {
        this.dialog.open(ProfileSettingPopup, {
            data: { title: 'Delete Account', type: 4, ...this.common }
        });
    }

    updateBasicInfo() {
        this.dialog.open(ProfileSettingPopup, {
            data: { title: 'Change Basic Info', type: 5, ...this.common }
        });
    }

    updateTimeZone() {
        const dialogRef = this.dialog.open(ProfileSettingPopup, {
            width: '460px',
            maxWidth: '95vw',
            data: { title: 'Change Time Zone', type: 6, ...this.common }
        });

        dialogRef.afterClosed().subscribe(result => {
            // Date formatting reads the zone once at start-up, so reload to apply it everywhere.
            if (result === 'timezone' && this.win) this.win.location.reload();
        });
    }
}
