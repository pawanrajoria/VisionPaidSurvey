import { Component } from '@angular/core';
import { SharedModule } from '../../../shared.module';

@Component({
    selector: 'app-apk-toggle',
    templateUrl: './apk-toggle.component.html',
    imports: [SharedModule],
    styleUrls: ['./apk-toggle.component.scss']
})
export class ApkToggleComponent {

    isOpen = true;   // default open like screenshot

    toggle() {
        this.isOpen = !this.isOpen;
    }

}
