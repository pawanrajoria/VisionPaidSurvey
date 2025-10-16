import { Component } from '@angular/core';
import { SharedModule } from '../../../../shared.module';
import { MatSnackBarRef } from '@angular/material/snack-bar';
import { LocalStorageService } from '../../../../localstorage.service';

@Component({
    selector: 'app-root-cookie-policy-popup',
    imports: [SharedModule],
    templateUrl: './root-cookie-policy-popup.html',
    styleUrls: ['./root-cookie-policy-popup.scss']
})
export class CookiePolicyPopupComponent {

    constructor(
        private snackBarRef: MatSnackBarRef<CookiePolicyPopupComponent>,
        private localStorageService: LocalStorageService
    ) { }

    acceptCookies() {
        this.localStorageService.setItem('cookiesAccepted', 'true');
        this.snackBarRef.dismiss();
    }

    rejectCookies() {
        this.localStorageService.setItem('cookiesAccepted', 'false');
        this.snackBarRef.dismiss();
    }

    closePopup() {
        this.snackBarRef.dismiss();
    }
}
