import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { SharedModule } from '../../../shared.module';

@Component({
    selector: 'app-survey-status',
    templateUrl: './survey-status.component.html',
    styleUrls: ['./survey-status.component.scss'],
    imports: [SharedModule]
})
export class SurveyStatusComponent {
    status = 0;

    constructor(private activatedRoute: ActivatedRoute) {
    }

    async ngOnInit() {
        const self = this;
        this.activatedRoute.queryParams.subscribe(params => {
            if (!!params['status'])
                self.status = params['status'];
        });
    }

    filterSurvey(sortType: number) {

    }
}
