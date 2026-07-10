import { inject } from '@angular/core';
import { BrowserService } from './browser.service';
import { UserService } from './components/layout/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ISurveyVM } from './components/home/survey/survey.vm';
import { MatDialog } from '@angular/material/dialog';
import { FraudService } from './frauddetection.service';
import { SurveyFeedBackPopupComponent } from './components/home/survey/survey-common-popup/survey-feedback-popup/survey-feedback-popup';
import { TakeSurveyComponent } from './components/userflow/take-survey/take-survey.component';
import { SurveyQualifyPopupComponent } from './components/home/survey/survey-common-popup/survey-qualify-popup/survey-qualify-popup';

export abstract class BaseSurveyComponent {
    protected readonly browserService = inject(BrowserService);
    protected win: Window | null = null;
    protected nav: Navigator | null = null;
    protected doc: Document | null = null;
    protected isBrowser: boolean = false;

    readonly userService = inject(UserService);
    readonly activateRoutelang = inject(ActivatedRoute);
    // readonly currentLang = this.getLangFromRoute(this.activateRoutelang);
    readonly currentLocale = this.getLocaleFromRoute(this.activateRoutelang);
    readonly dialog = inject(MatDialog);
    readonly fraudService = inject(FraudService);

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
                        alert('Popup blocked. Please allow popups for this site.');
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

                await this.logUserActivity("Survey", "StartSurvey", "Click", item.clickUrl);
                await this.feedbackSurvey(item);
            }
        } catch (e) {
            console.error('Failed to open survey in browser:', e);
            alert('Could not start the survey. Please check your connection.');
        }
    }


    async feedbackSurvey(item: ISurveyVM) {
        const dialofref = this.dialog.open(SurveyFeedBackPopupComponent);
        dialofref.afterClosed().subscribe(async (result) => {
            if (result === "submitForm") {
                // call rating api
                dialofref.close();
            } else if (result === "close") {
                // this.getSurveys();
                dialofref.close();
            }
        });
    }

    async openTakeSurvey(item: ISurveyVM) {

        const dialogRef = this.dialog.open(TakeSurveyComponent, {
            data: {
                landedUrl: item.clickUrl,
                surveyItem: item
            }
        });

        const result = await dialogRef.afterClosed().toPromise();

        if (!result) {
            return;
        }

        if (result.role === 'qualify') {
            const surveyItem = { ...item };
            surveyItem.clickUrl = result.data;

            await this.qualifySurvey(surveyItem);
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
