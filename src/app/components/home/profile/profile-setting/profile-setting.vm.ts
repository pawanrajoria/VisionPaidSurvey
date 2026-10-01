export interface ProfileSettingDialogData {
    title: string;
    type: number;
    /** False for accounts created with Google / Apple / Facebook that never set a password. */
    hasPassword?: boolean;
    countryCode?: string;
    timeZone?: string | null;
}
