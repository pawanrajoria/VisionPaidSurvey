import { Component } from '@angular/core';
import { SharedModule } from '../../../shared.module';

@Component({
    selector: 'app-offerwall-profile',
    templateUrl: './offerwall-profile.component.html',
    styleUrls: ['./offerwall-profile.component.scss'],
    imports: [SharedModule]
})
export class OfferwallProfileComponent {
    sessionTotal = 0;
    thisMonth = 0;
    lifetime = 50;
}
