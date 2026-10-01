import { Component, OnDestroy, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { ISurveyVM } from "./survey.vm";
import { SurveyService } from "./survey.service";
import { SurveyInstructionPopupComponent } from "./survey-common-popup/survey-instruction-popup/survey-instruction-popup";
import { BaseSurveyComponent } from "../../../base.survey.component";
import { Subject, takeUntil } from "rxjs";

type SurveySort = 'best' | 'short' | 'most';

/** Parses "4.5", "20 min", null... to a number; anything unreadable becomes 0. */
function toNumber(value: unknown): number {
    const parsed = parseFloat(String(value ?? ''));
    return Number.isFinite(parsed) ? parsed : 0;
}

@Component({
    selector: 'app-survey',
    imports: [SharedModule],
    templateUrl: './survey.component.html',
    styleUrls: ['./survey.component.scss']
})
export class SurveyComponent extends BaseSurveyComponent implements OnInit, OnDestroy {
    private destroy$ = new Subject<void>();
    isApiLoaded = false;
    surveys: Array<ISurveyVM> = [];
    filteredSurveys = [...this.surveys];

    /** Tab id + translation key (labels used to be the sort key and the visible English text at once). */
    readonly links: { id: SurveySort; label: string }[] = [
        { id: 'best', label: 'app.survey.tabBest' },
        { id: 'short', label: 'app.survey.tabShort' },
        { id: 'most', label: 'app.survey.tabMost' }
    ];
    activeLink: SurveySort = 'best';

    constructor(private surveyService: SurveyService) {
        super();
    }

    async ngOnInit() {

        this.fraudService.resetTracking();
        this.fraudService.startTracking();

        this.surveyService.refresh$
            .pipe(takeUntil(this.destroy$))
            .subscribe(async () => {
                await this.getSurveys();
                this.filterItems();
            });

        await this.getSurveys();
        this.isApiLoaded = true;
        this.filterItems();
    }

    ngOnDestroy(): void {
        // Without this the refresh subscription lived on after leaving the page and kept
        // reloading surveys for a component that no longer exists.
        this.destroy$.next();
        this.destroy$.complete();
    }

    changeSurveyType(link: SurveySort) {
        this.activeLink = link;
        this.filterItems();
    }

    /** Server explanation when surveys are hidden (daily limit for new accounts, proxy detected). */
    restrictionMessage = "";

    async getSurveys() {
        const self = this;
        let output: any = null;
        try {
            output = await self.surveyService.getSurveys();
        } catch {
            return; // the interceptor already told the user; keep whatever is on screen
        }
        self.restrictionMessage = output?.restrictionMessage ?? "";
        const list: ISurveyVM[] = Array.isArray(output?.surveys) ? output.surveys : [];
        // Profile ("REQUIRED") surveys first; the tab sort is applied in filterItems().
        self.surveys = list.sort((a: any, b: any) =>
            (b.isProfileSurvey === true ? 1 : 0) - (a.isProfileSurvey === true ? 1 : 0));
    }

    filterItems() {
        const profileFirst = (a: ISurveyVM, b: ISurveyVM) =>
            (b.isProfileSurvey === true ? 1 : 0) - (a.isProfileSurvey === true ? 1 : 0);

        this.filteredSurveys = [...this.surveys].sort((a, b) => {
            const pinned = profileFirst(a, b);
            if (pinned !== 0) return pinned;

            if (this.activeLink === 'most') {
                return toNumber(b.points) - toNumber(a.points);
            }
            if (this.activeLink === 'short') {
                return toNumber(a.loi) - toNumber(b.loi);
            }
            // Best match: highest conversion first, then highest points. Missing conversion
            // values used to produce NaN comparisons and an effectively random order.
            return (toNumber(b.conversion) - toNumber(a.conversion)) || (toNumber(b.points) - toNumber(a.points));
        });
    }

    /** Five entries of 'filled' | 'half' | 'empty'. Ratings such as "4.5" now show a half star. */
    getStars(rating: string): string[] {
        const value = Math.max(0, Math.min(5, toNumber(rating)));
        const stars: string[] = [];
        for (let i = 1; i <= 5; i++) {
            if (value >= i) stars.push('filled');
            else if (value >= i - 0.5) stars.push('half');
            else stars.push('empty');
        }
        return stars;
    }

    /** Stable identity for a survey card: its link is unique, its name often is not. */
    trackSurvey(index: number, item: ISurveyVM): string {
        return item.clickUrl || `${item.name}-${index}`;
    }

    async attemptSurvey(item: ISurveyVM) {
        if (item.isProfileSurvey) {
            this.openSurveyInstruction(item);
        }
        else {
            this.startSurvey(item);
            this.removeSurveyFromList(item);
        }
    }

    removeSurveyFromList(item: ISurveyVM) {
        // Matching on the name removed every survey that shared it (many do).
        this.surveys = this.surveys.filter(s => s !== item && s.clickUrl !== item.clickUrl);
        this.filteredSurveys = this.filteredSurveys.filter(s => s !== item && s.clickUrl !== item.clickUrl);
    }

    async openSurveyInstruction(item: ISurveyVM) {
        const dialofref = this.dialog.open(SurveyInstructionPopupComponent, {
            width: '480px',          // Reduced from 600px
            maxWidth: '92vw',
            maxHeight: '85vh',       // Enforces total height limit
            autoFocus: false,
            panelClass: 'survey-instruction-dialog'
        });
        dialofref.afterClosed().subscribe(async (result) => {
            if (result === "startSurvey") {
                await this.startSurvey(item);
                await this.getSurveys();
                this.filterItems();
            }
        });
    }

    hasProfileSurvey(): boolean {
        return this.filteredSurveys?.some(survey => survey.isProfileSurvey === true) ?? false;
    }
}
