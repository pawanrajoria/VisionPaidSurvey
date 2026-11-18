import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../../shared.module';
import { SURVEY_RESULT_PARAM, SURVEY_RESULT_TERMINATE, surveyReturnPath } from '../../../survey-return';

@Component({
    selector: 'app-survey-status',
    templateUrl: './survey-status.component.html',
    styleUrls: ['./survey-status.component.scss'],
    imports: [SharedModule]
})
export class SurveyStatusComponent {
    status = 0;

    constructor(private activatedRoute: ActivatedRoute, private router: Router,
        @Inject(PLATFORM_ID) private platformId: Object) {
    }

    async ngOnInit() {
        const self = this;
        this.activatedRoute.queryParams.subscribe(params => {
            if (!!params['status'])
                self.status = params['status'];

            // Screened out / over quota / security: back to the page the survey was started from, where the
            // "Survey Disqualified" popup opens (LayoutComponent). A complete (1) keeps this page.
            if (self.status && self.status != 1 && isPlatformBrowser(self.platformId)) {
                const locale = (self.router.url || '').split(/[/?#]/).filter(Boolean)[0] || 'en-us';
                const path = surveyReturnPath(typeof window !== 'undefined' ? window : null, locale);
                self.router.navigateByUrl(`${path}?${SURVEY_RESULT_PARAM}=${SURVEY_RESULT_TERMINATE}`, { replaceUrl: true });
            }
        });
    }

    filterSurvey(sortType: number) {

    }
}
