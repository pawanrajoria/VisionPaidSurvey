import { Component, inject, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { SharedModule } from '../../../../shared.module';
import { ProgrammingSurveyService } from '../programming.survey.service';

@Component({
  selector: 'app-survey-questions',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    SharedModule
  ],
  templateUrl: './survey-questions.component.html',
  styleUrls: ['./survey-questions.component.scss']
})
export class SurveyQuestionsComponent implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private fb = inject(FormBuilder);
  private programmingSurveyService = inject(ProgrammingSurveyService);

  currentQuestion = 1;
  totalQuestions = 14;
  npsScale: number[] = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  form!: FormGroup;
  respondenttoken = '';
  isSubmitting = false;

  constructor(@Inject(PLATFORM_ID) private platformId: object) { }

  ngOnInit(): void {
    this.initForm();
    this.resolveToken();
  }

  private initForm(): void {
    this.form = this.fb.group({
      // Question 1
      earningHabits: ['', Validators.required],

      // Question 2
      primaryRetentionFactor: ['', Validators.required],

      // Question 3 (Checkboxes)
      deviceMobileBrowser: [false],
      deviceDedicatedApp: [false],
      deviceDesktopLaptop: [false],
      deviceTablet: [false],

      // Question 4 (Attention verification gate)
      attentionCheck: ['', Validators.required],

      // Question 5 (Likert ratings)
      ratePayoutFairness: ['', Validators.required],
      rateScreeningTransparency: ['', Validators.required],

      // Question 6 (Brand awareness)
      profitPillerAwareness: ['', Validators.required],

      // Question 7 (Conditional branch controls)
      existingUserConstraint: [''],
      newUserIncentive: [''],

      // Question 8
      benchmarkPlatform: ['', Validators.required],

      // Question 9
      scenarioPreference: ['', Validators.required],

      // Question 10 (Task variety checkboxes)
      taskAppTesting: [false],
      taskAdFeedback: [false],
      taskAudioTranscription: [false],
      taskReceiptScanning: [false],
      taskOnlySurveys: [false],

      // Question 11
      redemptionIdeal: ['', Validators.required],

      // Question 12 (Qualitative - min 50 characters to enforce effort)
      frustrationFeedback: ['', [Validators.required, Validators.minLength(50)]],

      // Question 13 (Qualitative - min 30 characters)
      profitPillerRecommendation: ['', [Validators.required, Validators.minLength(30)]],

      // Question 14 (NPS)
      npsScore: ['', Validators.required]
    });
  }

  private resolveToken(): void {
    this.route.queryParamMap.subscribe(params => {
      this.respondenttoken = params.get('token') ?? params.get('Token') ?? '';
    });
  }

  get progress(): number {
    return Math.round((this.currentQuestion / this.totalQuestions) * 100);
  }

  next(): void {
    if (!this.isCurrentQuestionValid()) {
      return;
    }

    if (this.currentQuestion < this.totalQuestions) {
      // Dynamic validation setup before landing on Question 7
      if (this.currentQuestion === 6) {
        this.updateBranchValidation();
      }

      this.currentQuestion++;
    } else {
      this.submit();
    }
  }

  previous(): void {
    if (this.currentQuestion > 1) {
      this.currentQuestion--;
    }
  }

  private updateBranchValidation(): void {
    const awareness = this.form.get('profitPillerAwareness')?.value;
    const isExistingUser = awareness === 'active_daily' || awareness === 'registered_inactive';

    const existingCtrl = this.form.get('existingUserConstraint');
    const newCtrl = this.form.get('newUserIncentive');

    if (isExistingUser) {
      existingCtrl?.setValidators(Validators.required);
      newCtrl?.clearValidators();
      newCtrl?.reset();
    } else {
      newCtrl?.setValidators(Validators.required);
      existingCtrl?.clearValidators();
      existingCtrl?.reset();
    }

    existingCtrl?.updateValueAndValidity();
    newCtrl?.updateValueAndValidity();
  }

  isCurrentQuestionValid(): boolean {
    switch (this.currentQuestion) {
      case 1:
        return this.form.get('earningHabits')?.valid ?? false;

      case 2:
        return this.form.get('primaryRetentionFactor')?.valid ?? false;

      case 3:
        return (
          !!this.form.get('deviceMobileBrowser')?.value ||
          !!this.form.get('deviceDedicatedApp')?.value ||
          !!this.form.get('deviceDesktopLaptop')?.value ||
          !!this.form.get('deviceTablet')?.value
        );

      case 4:
        return this.form.get('attentionCheck')?.valid ?? false;

      case 5:
        return (
          (this.form.get('ratePayoutFairness')?.valid ?? false) &&
          (this.form.get('rateScreeningTransparency')?.valid ?? false)
        );

      case 6:
        return this.form.get('profitPillerAwareness')?.valid ?? false;

      case 7: {
        const awareness = this.form.get('profitPillerAwareness')?.value;
        const isExistingUser = awareness === 'active_daily' || awareness === 'registered_inactive';
        return isExistingUser
          ? (this.form.get('existingUserConstraint')?.valid ?? false)
          : (this.form.get('newUserIncentive')?.valid ?? false);
      }

      case 8:
        return this.form.get('benchmarkPlatform')?.valid ?? false;

      case 9:
        return this.form.get('scenarioPreference')?.valid ?? false;

      case 10:
        return (
          !!this.form.get('taskAppTesting')?.value ||
          !!this.form.get('taskAdFeedback')?.value ||
          !!this.form.get('taskAudioTranscription')?.value ||
          !!this.form.get('taskReceiptScanning')?.value ||
          !!this.form.get('taskOnlySurveys')?.value
        );

      case 11:
        return this.form.get('redemptionIdeal')?.valid ?? false;

      case 12:
        return this.form.get('frustrationFeedback')?.valid ?? false;

      case 13:
        return this.form.get('profitPillerRecommendation')?.valid ?? false;

      case 14:
        return this.form.get('npsScore')?.valid ?? false;

      default:
        return false;
    }
  }

  async submit(): Promise<void> {
    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    if (!this.respondenttoken) {
      console.error('Respondent token is missing. Cannot submit survey response.');
      return;
    }

    this.isSubmitting = true;
    const value = this.form.getRawValue();

    // Check attention trap verification (Question 4 expected 'neutral')
    const passedAttentionVerification = value.attentionCheck === 'neutral';

    const surveyData = {
      surveyId: null,
      campaignId: null,
      respondentId: this.respondenttoken,

      // Sections 1 - 3
      earningHabits: value.earningHabits,
      primaryRetentionFactor: value.primaryRetentionFactor,
      devices: {
        mobileBrowser: !!value.deviceMobileBrowser,
        dedicatedApp: !!value.deviceDedicatedApp,
        desktopLaptop: !!value.deviceDesktopLaptop,
        tablet: !!value.deviceTablet
      },

      // Section 4 & 5 (Quality & Likert Grids)
      attentionPassed: passedAttentionVerification,
      ratings: {
        payoutFairness: Number(value.ratePayoutFairness),
        screeningTransparency: Number(value.rateScreeningTransparency)
      },

      // Section 6 & 7 (Awareness & Branching)
      brandAwareness: value.profitPillerAwareness,
      existingUserConstraint: value.existingUserConstraint || null,
      newUserIncentive: value.newUserIncentive || null,

      // Section 8 - 11
      benchmarkPlatform: value.benchmarkPlatform,
      scenarioPreference: value.scenarioPreference,
      taskPreferences: {
        appTesting: !!value.taskAppTesting,
        adFeedback: !!value.taskAdFeedback,
        audioTranscription: !!value.taskAudioTranscription,
        receiptScanning: !!value.taskReceiptScanning,
        surveysOnly: !!value.taskOnlySurveys
      },
      redemptionIdeal: value.redemptionIdeal,

      // Section 12 & 13 (Open-Ended Responses)
      frustrationFeedback: value.frustrationFeedback.trim(),
      profitPillerRecommendation: value.profitPillerRecommendation.trim(),

      // Section 14
      npsScore: Number(value.npsScore),

      completedAt: new Date().toISOString()
    };

    // 1 = Complete. A failed attention check is reported as 8 (client security terminate): the
    // router has no handler for 2, so those respondents were never recorded as terminated.
    const statusId = passedAttentionVerification ? 1 : 8;

    try {
      // Save the answers first, then move on. Navigating first meant a slow or failed save
      // was invisible and the response could be lost.
      await this.programmingSurveyService.captureSurveyResponse(surveyData);
    } catch (error) {
      console.error('Unable to save survey response:', error);
    } finally {
      this.isSubmitting = false;
      this.router.navigateByUrl(`/survey/completed?Token=${encodeURIComponent(this.respondenttoken)}&StatusId=${statusId}`);
    }
  }
}