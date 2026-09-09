import { Component } from '@angular/core';
import { PublicSharedModule } from '../../../public-shared.module';
import { NgxQrcodeStylingComponent } from 'ngx-qrcode-styling';

@Component({
    selector: 'app-apk-toggle',
    templateUrl: './apk-toggle.component.html',
    imports: [PublicSharedModule,NgxQrcodeStylingComponent],
    styleUrls: ['./apk-toggle.component.scss']
})
export class ApkToggleComponent {

    isOpen = true;   // default open like screenshot

    toggle() {
        this.isOpen = !this.isOpen;
    }

}
