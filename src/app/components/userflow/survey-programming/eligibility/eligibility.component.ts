import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-eligibility',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatCardModule,
    MatButtonModule,
    MatFormFieldModule,
    MatSelectModule,
    MatInputModule,
    MatRadioModule
  ],
  template: `

    <div class="survey-container">

      <mat-card class="survey-card">

        <h2>Tell us about yourself</h2>

        <p class="subtitle">
          These questions help us understand our research participants.
        </p>

        <form [formGroup]="form">

          <mat-form-field appearance="outline">
            <mat-label>Country</mat-label>

            <mat-select formControlName="country">

              <mat-option value="US">United States</mat-option>
              <mat-option value="CA">Canada</mat-option>
              <mat-option value="UK">United Kingdom</mat-option>
              <mat-option value="AU">Australia</mat-option>
              <mat-option value="FR">France</mat-option>
              <mat-option value="DE">Germany</mat-option>
              <mat-option value="IN">India</mat-option>

            </mat-select>

          </mat-form-field>

          <mat-form-field appearance="outline">
            <mat-label>Age</mat-label>

            <input
              matInput
              type="number"
              formControlName="age">

          </mat-form-field>

          <label class="question-label">
            Gender
          </label>

          <mat-radio-group formControlName="gender">

            <mat-radio-button value="male">
              Male
            </mat-radio-button>

            <mat-radio-button value="female">
              Female
            </mat-radio-button>

            <mat-radio-button value="other">
              Other
            </mat-radio-button>

            <mat-radio-button value="prefer_not">
              Prefer not to say
            </mat-radio-button>

          </mat-radio-group>

          <mat-form-field appearance="outline">

            <mat-label>Employment status</mat-label>

            <mat-select formControlName="employment">

              <mat-option value="full_time">
                Full time
              </mat-option>

              <mat-option value="part_time">
                Part time
              </mat-option>

              <mat-option value="self_employed">
                Self employed
              </mat-option>

              <mat-option value="student">
                Student
              </mat-option>

              <mat-option value="unemployed">
                Not currently employed
              </mat-option>

              <mat-option value="retired">
                Retired
              </mat-option>

            </mat-select>

          </mat-form-field>

          <mat-form-field appearance="outline">

            <mat-label>Education</mat-label>

            <mat-select formControlName="education">

              <mat-option value="school">
                High school
              </mat-option>

              <mat-option value="college">
                College / University
              </mat-option>

              <mat-option value="postgraduate">
                Postgraduate
              </mat-option>

              <mat-option value="other">
                Other
              </mat-option>

            </mat-select>

          </mat-form-field>

          <button
            mat-flat-button
            color="primary"
            class="continue-button"
            [disabled]="form.invalid"
            (click)="continue()">

            Continue

          </button>

        </form>

      </mat-card>

    </div>
  `,

  styles: [`

    .survey-container {
      min-height: 100vh;
      background: #f5f7fb;
      padding: 30px 15px;
      display: flex;
      justify-content: center;
    }

    .survey-card {
      width: 100%;
      max-width: 650px;
      padding: 35px;
      border-radius: 18px;
    }

    h2 {
      margin-bottom: 5px;
    }

    .subtitle {
      color: #777;
      margin-bottom: 30px;
    }

    mat-form-field {
      width: 100%;
      margin-bottom: 15px;
    }

    .question-label {
      display: block;
      margin: 10px 0;
      font-weight: 500;
    }

    mat-radio-group {
      display: flex;
      flex-wrap: wrap;
      gap: 15px;
      margin-bottom: 25px;
    }

    .continue-button {
      width: 100%;
      height: 48px;
    }

  `]
})
export class EligibilityComponent {
  private route = inject(ActivatedRoute);
  respondenttoken = '';
  form: any;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {
    this.form = this.fb.group({
      country: ['', Validators.required],
      age: ['', [
        Validators.required,
        Validators.min(18),
        Validators.max(100)
      ]],
      gender: ['', Validators.required],
      employment: ['', Validators.required],
      education: ['', Validators.required]
    });
  }

  continue() {

    if (this.form.invalid)
      return;

    sessionStorage.setItem(
      'eligibility',
      JSON.stringify(this.form.value)
    );


    this.route.queryParamMap.subscribe(params => {
      this.respondenttoken = params.get('token') ?? '';
    });

    if (!!this.respondenttoken) {
      this.router.navigateByUrl('/survey/questions?token=' + this.respondenttoken);
    }
  }
}