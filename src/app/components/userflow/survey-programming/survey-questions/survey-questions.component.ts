import { Component, inject, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatHint } from "@angular/material/form-field";
import { SharedModule } from '../../../../shared.module';
import { ProgrammingSurveyService } from '../programming.survey.service';

@Component({
  selector: 'app-survey-questions',
  standalone: true,
  imports: [
    SharedModule,
  ],
  templateUrl: './survey-questions.component.html',
  styleUrls: ['./survey-questions.component.scss']
})
export class SurveyQuestionsComponent {
  private route = inject(ActivatedRoute);
  currentQuestion = 1;

  totalQuestions = 7;

  form: FormGroup;
  respondenttoken = '';

  constructor(
    private router: Router,
    private fb: FormBuilder,
    private programmingSurveyService: ProgrammingSurveyService,
    @Inject(PLATFORM_ID) private platformId: object
  ) {

    this.form = this.fb.group({

      surveyFrequency: [
        '',
        Validators.required
      ],

      rewardPreference: [
        '',
        Validators.required
      ],

      smartphone: [
        false
      ],

      desktop: [
        false
      ],

      tablet: [
        false
      ],

      heardProfitPiller: [
        '',
        Validators.required
      ],

      profitPillerRating: [
        ''
      ],

      profitPillerAppeal: [
        ''
      ],

      preferredPlatform: [
        '',
        Validators.required
      ],

      profitPillerFeedback: [
        ''
      ]

    });
  }


  get progress(): number {
    return (this.currentQuestion / this.totalQuestions) * 100;
  }


  next(): void {

    if (!this.isCurrentQuestionValid()) {
      return;
    }

    if (this.currentQuestion < this.totalQuestions) {

      this.currentQuestion++;

      /*
       * If respondent hasn't heard of ProfitPiller,
       * there is no reason to ask them for an actual
       * experience rating.
       */
      if (
        this.currentQuestion === 5 &&
        this.form.get('heardProfitPiller')?.value !== 'yes'
      ) {

        this.form
          .get('profitPillerAppeal')
          ?.setValidators(Validators.required);

      }

      if (
        this.currentQuestion === 5 &&
        this.form.get('heardProfitPiller')?.value === 'yes'
      ) {

        this.form
          .get('profitPillerRating')
          ?.setValidators(Validators.required);
      }

      this.form.get('profitPillerRating')?.updateValueAndValidity();
      this.form.get('profitPillerAppeal')?.updateValueAndValidity();

    } else {

      this.submit();
    }
  }


  previous(): void {

    if (this.currentQuestion > 1) {

      this.currentQuestion--;

    }
  }


  isCurrentQuestionValid(): boolean {

    switch (this.currentQuestion) {

      case 1:
        return this.form.get('surveyFrequency')?.valid ?? false;

      case 2:
        return this.form.get('rewardPreference')?.valid ?? false;

      case 3:

        return (
          this.form.get('smartphone')?.value ||
          this.form.get('desktop')?.value ||
          this.form.get('tablet')?.value
        );

      case 4:
        return this.form.get('heardProfitPiller')?.valid ?? false;

      case 5:

        if (
          this.form.get('heardProfitPiller')?.value === 'yes'
        ) {

          return this.form.get('profitPillerRating')?.valid ?? false;

        }

        return this.form.get('profitPillerAppeal')?.valid ?? false;

      case 6:
        return this.form.get('preferredPlatform')?.valid ?? false;

      case 7:
        return true;

      default:
        return false;
    }
  }


  async submit() {

    if (!this.form.valid) {
      this.form.markAllAsTouched();
      return;
    }

    this.route.queryParamMap.subscribe(params => {
      this.respondenttoken = params.get('token') ?? '';
    });

    if(!this.respondenttoken) {
      console.error('Respondent token is missing. Cannot submit survey response.');
      return;
    }

    const value = this.form.getRawValue();

    const surveyData = {
      surveyId: null,
      campaignId: null,
      respondentId: this.respondenttoken,

      surveyFrequency: value.surveyFrequency,
      rewardPreference: value.rewardPreference,

      smartphone: value.smartphone,
      desktop: value.desktop,
      tablet: value.tablet,

      heardProfitPiller: value.heardProfitPiller,

      profitPillerRating:
        value.profitPillerRating !== ''
          ? Number(value.profitPillerRating)
          : null,

      profitPillerAppeal:
        value.profitPillerAppeal !== ''
          ? Number(value.profitPillerAppeal)
          : null,

      preferredPlatform: value.preferredPlatform,

      profitPillerFeedback:
        value.profitPillerFeedback || null,

      startedAt: new Date().toISOString()
    };

    try {


      this.router.navigateByUrl('/survey/completed?Token=' + this.respondenttoken + '&StatusId=1');

      const response = await this.programmingSurveyService.captureSurveyResponse(surveyData);

      console.log(
        'Survey response saved:',
        response
      );



    } catch (error) {

      console.error(
        'Unable to save survey response:',
        error
      );

    }
  }

}