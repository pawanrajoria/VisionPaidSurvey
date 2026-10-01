import { Component, OnInit, inject } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { Router } from "@angular/router";
import { SharedModule } from "../../../shared.module";
import { BaseComponent } from "../../../base.component";
import { EngagementService } from "../engagement/engagement.service";
import { IEngagementSummary } from "../engagement/engagement.vm";
import { ProfileService } from "../profile/profile.service";
import { AccountService } from "../account.service";
import { Iso639Map } from "../../../supporteslanguage";
import {
    IProfileQuestionAnswerDetailsDtos,
    IProfileQuestionDetailsDtos,
    IProfileQuestionDtos
} from "../profile/profile-data/profile-data.vm";

/** sessionStorage flag: the user chose "later" - don't force the welcome flow again this session. */
export { ONBOARDING_SKIPPED_KEY } from '../engagement/engagement.vm';
import { ONBOARDING_SKIPPED_KEY } from '../engagement/engagement.vm';

const SINGLE = 2, MULTI = 3, NUMBER = 8, TEXT = 10;
const MAX_OPTIONS = 40;
const MIN_AGE = 16;

@Component({
    selector: 'app-welcome',
    imports: [SharedModule],
    templateUrl: './welcome.component.html',
    styleUrls: ['./welcome.component.scss']
})
export class WelcomeComponent extends BaseComponent implements OnInit {
    loading = true;
    saving = false;
    error = '';

    summary: IEngagementSummary | null = null;
    rewardPoints = 10;

    /** 0 = basics, 1..n = profile questions, n+1 = done */
    step = 0;
    questions: IProfileQuestionDetailsDtos[] = [];
    answeredCount = 0;
    finished = false;
    awardedPoints = 0;
    resultMessage = '';

    gender: number | null = null;
    day: number | null = null;
    month: number | null = null;
    year: number | null = null;
    zip = '';

    readonly genders = [
        { value: 1, label: 'app.welcome.male', icon: 'male' },
        { value: 2, label: 'app.welcome.female', icon: 'female' },
        { value: 0, label: 'app.welcome.other', icon: 'transgender' }
    ];
    private readonly translate = inject(TranslateService);
    /** Month numbers; the names come from the app.month.* translations. */
    readonly months = Array.from({ length: 12 }, (_, i) => i + 1);
    readonly days = Array.from({ length: 31 }, (_, i) => i + 1);
    readonly years: number[];

    constructor(private engagement: EngagementService, private profileService: ProfileService,
        private accountService: AccountService, private router: Router) {
        super();
        const latest = new Date().getFullYear() - MIN_AGE;
        this.years = Array.from({ length: 85 }, (_, i) => latest - i);
    }

    get totalSteps(): number { return this.questions.length + 1; }
    get progress(): number { return this.finished ? 100 : Math.round((this.step / this.totalSteps) * 100); }
    get activeQuestion(): IProfileQuestionDetailsDtos | null { return this.step > 0 ? this.questions[this.step - 1] ?? null : null; }
    get isSingle(): boolean { return this.activeQuestion?.typeId === SINGLE; }
    get isMulti(): boolean { return this.activeQuestion?.typeId === MULTI; }
    get isNumber(): boolean { return this.activeQuestion?.typeId === NUMBER; }
    get isText(): boolean { return this.activeQuestion?.typeId === TEXT; }

    async ngOnInit() {
        this.summary = await this.engagement.getSummary(true);
        const onboarding = this.summary?.onboarding;

        if (!onboarding || !onboarding.available || onboarding.completed) {
            this.goToEarn();
            return;
        }

        this.rewardPoints = onboarding.rewardPoints;
        this.prefillBasics(onboarding.dateOfBirth, onboarding.gender, onboarding.zip);
        await this.loadQuestions(onboarding.questionCount);
        this.loading = false;
    }

    private prefillBasics(dateOfBirth?: string | null, gender?: number, zip?: string | null) {
        this.zip = (zip ?? '').trim();
        if (dateOfBirth) {
            const parsed = new Date(dateOfBirth);
            if (!isNaN(parsed.getTime())) {
                this.day = parsed.getUTCDate();
                this.month = parsed.getUTCMonth() + 1;
                this.year = parsed.getUTCFullYear();
                // Gender 0 means "Other" and is also the database default, so only trust it
                // once the rest of the profile has been filled in.
                this.gender = gender ?? null;
            }
        } else if (gender === 1 || gender === 2) {
            this.gender = gender;
        }
    }

    /** Picks the first unanswered, easy-to-answer questions. A failure here never blocks the bonus. */
    private async loadQuestions(limit: number) {
        if (!limit || limit < 1) return;
        try {
            const lang2 = (this.nav?.language ?? 'en').split('-')[0].toLowerCase();
            const categories: IProfileQuestionDtos[] =
                await this.profileService.getprofileQualifications(Iso639Map[lang2] || 'eng');

            const picked: IProfileQuestionDetailsDtos[] = [];
            for (const category of categories ?? []) {
                for (const q of category.qualifications ?? []) {
                    if (picked.length >= limit) break;
                    const answers = q.answers ?? [];
                    const supported = q.typeId === SINGLE || q.typeId === MULTI || q.typeId === NUMBER || q.typeId === TEXT;
                    const alreadyAnswered = q.isSelected || answers.some(a => a.isSelected);
                    if (!supported || alreadyAnswered || !q.questionName || answers.length === 0) continue;
                    if ((q.typeId === SINGLE || q.typeId === MULTI) && answers.length > MAX_OPTIONS) continue;
                    picked.push(q);
                }
            }
            this.questions = picked;
        } catch {
            this.questions = [];
        }
    }

    get basicsError(): string {
        if (this.gender === null) return this.translate.instant('app.welcome.errGender');
        if (!this.day || !this.month || !this.year) return this.translate.instant('app.welcome.errDob');
        const dob = new Date(Date.UTC(this.year, this.month - 1, this.day));
        if (dob.getUTCDate() !== this.day || dob.getUTCMonth() !== this.month - 1) return this.translate.instant('app.welcome.errDate');
        if (this.ageOf(dob) < MIN_AGE) return this.translate.instant('app.welcome.errAge', { age: MIN_AGE });
        if (this.zip.trim().length < 3) return this.translate.instant('app.welcome.errZip');
        return '';
    }

    private ageOf(dob: Date): number {
        const now = new Date();
        let age = now.getUTCFullYear() - dob.getUTCFullYear();
        const beforeBirthday = now.getUTCMonth() < dob.getUTCMonth() ||
            (now.getUTCMonth() === dob.getUTCMonth() && now.getUTCDate() < dob.getUTCDate());
        if (beforeBirthday) age--;
        return age;
    }

    private get dobIso(): string {
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${this.year}-${pad(this.month!)}-${pad(this.day!)}`;
    }

    async continueFromBasics() {
        this.error = this.basicsError;
        if (this.error) return;
        if (this.questions.length === 0) {
            await this.finish();
        } else {
            this.step = 1;
        }
    }

    selectSingle(answer: IProfileQuestionAnswerDetailsDtos) {
        this.activeQuestion?.answers.forEach(a => a.isSelected = false);
        answer.isSelected = true;
    }

    toggleMulti(answer: IProfileQuestionAnswerDetailsDtos) {
        answer.isSelected = !answer.isSelected;
    }

    get canSubmitQuestion(): boolean {
        const q = this.activeQuestion;
        if (!q) return false;
        if (q.typeId === NUMBER || q.typeId === TEXT) {
            return q.answers.some(a => (a.answerText ?? '').toString().trim() !== '');
        }
        return q.answers.some(a => a.isSelected);
    }

    async submitQuestion() {
        const q = this.activeQuestion;
        if (!q || !this.canSubmitQuestion || this.saving) return;

        this.saving = true;
        this.error = '';
        try {
            let request: IProfileQuestionAnswerDetailsDtos[];
            if (q.typeId === NUMBER || q.typeId === TEXT) {
                request = q.answers.map(a => ({ ...a, answerText: (a.answerText ?? '').toString().trim() }));
            } else {
                request = q.answers.filter(a => a.isSelected);
            }
            await this.profileService.saveProfileQualification(request);
            this.answeredCount++;
            await this.next();
        } catch {
            this.error = this.translate.instant('app.welcome.errSave');
        } finally {
            this.saving = false;
        }
    }

    async skipQuestion() {
        if (this.saving) return;
        this.error = '';
        await this.next();
    }

    private async next() {
        if (this.step >= this.questions.length) {
            await this.finish();
        } else {
            this.step++;
        }
    }

    back() {
        this.error = '';
        if (this.step > 0) this.step--;
    }

    private async finish() {
        this.saving = true;
        this.error = '';
        try {
            const result = await this.engagement.completeOnboarding({
                dateOfBirth: this.dobIso,
                gender: this.gender ?? 0,
                zip: this.zip.trim(),
                answeredCount: this.answeredCount
            });

            if (!result?.isSuccess) {
                this.error = result?.message || this.translate.instant('app.welcome.errGeneric');
                this.step = 0;
                return;
            }

            this.awardedPoints = result.pointsAwarded;
            this.resultMessage = result.message;
            this.finished = true;
            this.step = this.totalSteps;
            this.refreshBalance();
        } catch {
            this.error = this.translate.instant('app.welcome.errGeneric');
        } finally {
            this.saving = false;
        }
    }

    private async refreshBalance() {
        try {
            const info = await this.accountService.getuserinfo();
            if (info) this.accountService.setUserBalanceInfo(info);
        } catch { /* the header refreshes on the next page load anyway */ }
    }

    later() {
        if (this.isBrowser) {
            try { sessionStorage.setItem(ONBOARDING_SKIPPED_KEY, '1'); } catch { /* private mode */ }
        }
        this.goToEarn();
    }

    goToEarn() {
        this.router.navigate(['/', this.currentLocale, 'app', 'earn']);
    }

    trackAnswer(_: number, answer: IProfileQuestionAnswerDetailsDtos) {
        return answer.answerId ?? answer.preCode ?? answer.answerName;
    }
}
