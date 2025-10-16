import { Component } from '@angular/core';
import { SharedModule } from '../../../shared.module';

@Component({
    selector: 'app-offerwall-reward',
    templateUrl: './offerwall-reward.component.html',
    styleUrls: ['./offerwall-reward.component.scss'],
    imports: [SharedModule]
})
export class OfferwallRewardComponent {
    sessionTotal = 0;
    thisMonth = 0;
    lifetime = 50;
}
