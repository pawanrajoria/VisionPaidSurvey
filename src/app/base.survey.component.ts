import { SUPPORTED_LOCALE_CODES } from './country-langiuage-list';
import { inject } from '@angular/core';
import { BrowserService } from './browser.service';
import { UserService } from './components/layout/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ISurveyVM } from './components/home/survey/survey.vm';
import { MatDialog } from '@angular/material/dialog';
import { FraudService } from './frauddetection.service';
import { ISurveyFeedback, SURVEY_FEEDBACK_REASONS, SurveyFeedBackPopupComponent } from './components/home/survey/survey-common-popup/survey-feedback-popup/survey-feedback-popup';
import { TranslateService } from '@ngx-translate/core';
import { TakeSurveyComponent } from './components/userflow/take-survey/take-survey.component';
import { SurveyQualifyPopupComponent } from './components/home/survey/survey-common-popup/survey-qualify-popup/survey-qualify-popup';
import { SurveyDisqualifyPopupComponent } from './components/home/survey/survey-common-popup/survey-disqualify-popup/survey-disqualify-popup';

export abstract class BaseSurveyComponent {
    protected readonly browserService = inject(BrowserService);
    protected win: Window | null = null;
    protected nav: Navigator | null = null;
    protected doc: Document | null = null;
    protected isBrowser: boolean = false;

    readonly userService = inject(UserService);
    readonly activateRoutelang = inject(ActivatedRoute);
    // readonly currentLang = this.getLangFromRoute(this.activateRoutelang);
    private readonly localeRouter = inject(Router);

    /**
     * Locale slug of the page on screen ("hi-in"). A getter, not a value captured once: the
     * header, menu and other long-lived components otherwise kept linking to the locale they
     * were created under, which switched the language back after the member changed it.
     */
    get currentLocale(): string {
        const first = (this.localeRouter.url || '').split(/[/?#]/).filter(Boolean)[0]?.toLowerCase();
        return first && SUPPORTED_LOCALE_CODES.has(first) ? first : this.getLocaleFromRoute(this.activateRoutelang);
    }
    readonly dialog = inject(MatDialog);
    readonly fraudService = inject(FraudService);
    protected readonly translateService = inject(TranslateService);

    constructor() {
        this.bindBrowserSetting(); // ✅ safe in constructor
    }

    async startSurvey(item: ISurveyVM) {
        try {
            if (item.clickUrl.trim().toLowerCase().indexOf('uf.samplevision.com/takesurvey') > 0 ||
                item.clickUrl.trim().toLowerCase().indexOf('profitpiller.com/survey/takesurvey') > 0
            ) {
                await this.openTakeSurvey(item);
            } else {

                if (this.win) {
                    let winNew = this.win.open('', '_blank');
                    if (!winNew) {
                        alert(this.translateService.instant('app.survey.popupBlocked'));
                        return;
                    }

                    // const fraudSignals: any = await this.fraudService.collectSignals();

                    // if (fraudSignals && fraudSignals.decision === "BLOCK") {
                    //     await this.logUserActivity("Survey", "StartSurvey", "SurveyScore", fraudSignals.decision);
                    //     winNew?.close(); // close opened tab if blocked
                    //     return;
                    // }

                    if (winNew) {
                        winNew.location.href = item.clickUrl;
                    }
                }

                // The survey is already open at this point. A failed activity log must not be
                // reported to the user as "could not start the survey".
                try {
                    await this.logUserActivity("Survey", "StartSurvey", "Click", item.clickUrl);
                } catch { /* logging only */ }
                await this.feedbackSurvey(item);
            }
        } catch (e) {
            console.error('Failed to open survey in browser:', e);
            alert(this.translateService.instant('app.survey.startFailed'));
        }
    }


    /**
     * "What happened?" dialog shown after a survey was opened in another tab. The answer used to
     * be thrown away (the submit handler was an empty stub). It is now stored in the user activity
     * log (page "Survey", event "Feedback"), where it shows up in the admin activity views.
     */
    async feedbackSurvey(item: ISurveyVM) {
        const dialofref = this.dialog.open(SurveyFeedBackPopupComponent);
        dialofref.afterClosed().subscribe(async (result: ISurveyFeedback | string | undefined) => {
            if (!result || typeof result === 'string' || result.action !== 'submitForm') return;

            const reason = SURVEY_FEEDBACK_REASONS[result.reason] ?? 'Not specified';
            const survey = `${item.name ?? ''} | ${item.clickUrl ?? ''}`.slice(0, 300);
            const remarks = result.comment ? `${result.comment} | ${survey}` : survey;
            try {
                await this.logUserActivity("Survey", "Feedback", reason, remarks);
            } catch { /* the interceptor already reported it */ }
        });
    }

    async openTakeSurvey(item: ISurveyVM) {

        const dialogRef = this.dialog.open(TakeSurveyComponent, {
            width: '560px',
            minWidth: '320px',
            maxWidth: '95vw',
            maxHeight: '90vh',
            autoFocus: false,
            panelClass: 'take-survey-dialog-panel',
            data: {
                landedUrl: item.clickUrl,
                surveyItem: item
            }
        });

        const result = await dialogRef.afterClosed().toPromise();

        if (!result) {
            return;
        }

        // A "qualified" result is only usable when it carries the survey link.
        if (result.role === 'qualify' && !!result.data) {
            const surveyItem = { ...item };
            surveyItem.clickUrl = result.data;



            if (item.isProfileSurvey) {
                if (this.win) {
                    let winNew = this.win.open('', '_blank');
                    if (!winNew) {
                        alert(this.translateService.instant('app.survey.popupBlocked'));
                        return;
                    }

                    if (winNew) {
                        winNew.location.href = surveyItem.clickUrl;
                    }
                }
            } else {
                await this.qualifySurvey(surveyItem);
            }
        }
        else if (result.role === 'disquality' || result.role === 'qualify') {
            await this.disqualifySurvey(item);
        }
    }

    async qualifySurvey(item: ISurveyVM) {
        const dialofref = this.dialog.open(SurveyQualifyPopupComponent);
        dialofref.afterClosed().subscribe(async (result) => {
            if (result === "participate") {
                dialofref.close();
                await this.startSurvey(item);
            } else if (result === "close") {
                dialofref.close();
            }
        });
    }

    async disqualifySurvey(item: ISurveyVM) {
        const dialofref = this.dialog.open(SurveyDisqualifyPopupComponent);
        dialofref.afterClosed().subscribe(async (result) => {
            if (result === "refresh") {
                dialofref.close();
            } else if (result === "close") {
                dialofref.close();
            }
        });
    }

    protected bindBrowserSetting(): void {
        this.isBrowser = this.browserService.isPlatformBrowser;
        if (this.isBrowser) {
            this.win = this.browserService.window;
            this.nav = this.browserService.navigator;
            this.doc = this.browserService.document;
        }
    }

    async logUserActivity(pageName: string, eventName: string, status: string, remarks: string) {
        await this.userService.logActivity({ eventName: eventName, pageName: pageName, status: status, remarks: remarks });
    }


    private getLangFromRoute(route: ActivatedRoute): string {
        let current: ActivatedRoute | null = route;

        while (current) {
            const lang = current.snapshot.paramMap.get('lang');
            if (lang) return lang;
            current = current.parent;
        }

        return 'en'; // fallback
    }

    private getLocaleFromRoute(route: ActivatedRoute): string {
        let current: ActivatedRoute | null = route;

        while (current) {
            const locale = current.snapshot.paramMap.get('locale');
            if (locale) {
                return locale;
            }
            current = current.parent;
        }

        return 'en-us';
    }

}
