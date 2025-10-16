import { Component } from '@angular/core';
import { SharedModule } from '../../../shared.module';

@Component({
    selector: 'app-offerwall-survey',
    templateUrl: './offerwall-survey.component.html',
    styleUrls: ['./offerwall-survey.component.scss'],
    imports: [SharedModule]
})
export class OfferwallSurveyComponent {
    surveys = [
        { coins: 432, time: 12, tag: 'HOT!', color: '#9c27b0' },
        { coins: 264, time: 20, tag: null, color: '#009688' },
        { coins: 36, time: 20, tag: 'New!', color: '#4db6ac' },
        { coins: 30, time: 29, tag: 'New!', color: '#80cbc4' },
        { coins: 24, time: 26, tag: 'New!', color: '#b2dfdb' },
        { coins: 84, time: 30, tag: null, color: '#26a69a' },
        { coins: 264, time: 4, tag: null, color: '#009688' },
        { coins: 678, time: 15, tag: 'New!', color: '#4db6ac' },
        { coins: 444, time: 15, tag: 'New!', color: '#26a69a' },
        { coins: 288, time: 15, tag: 'New!', color: '#009688' },
        { coins: 36, time: 2, tag: 'New!', color: '#4db6ac' },
        { coins: 864, time: 30, tag: null, color: '#00796b' },
    ];
}
