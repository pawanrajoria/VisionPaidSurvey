import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-survey-welcome',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  template: `
    <div class="survey-page">

      <mat-card class="survey-card">

        <div class="brand">
          <mat-icon>poll</mat-icon>
          <span>ProfitPiller</span>
        </div>

        <div class="hero-icon">
          <mat-icon>assignment</mat-icon>
        </div>

        <h1>Online Survey & Consumer Study</h1>

        <p class="description">
          We would like to understand how people participate in
          online surveys, rewards programs and consumer research.
        </p>

        <div class="info-row">

          <div>
            <mat-icon>schedule</mat-icon>
            <span>3–4 minutes</span>
          </div>

          <div>
            <mat-icon>phone_android</mat-icon>
            <span>Mobile friendly</span>
          </div>

        </div>

        <button
          mat-flat-button
          color="primary"
          class="start-button"
          (click)="startSurvey()">

          Start Survey
          <mat-icon>arrow_forward</mat-icon>

        </button>

        <p class="privacy">
          Your responses will be used for research purposes.
        </p>

      </mat-card>

    </div>
  `,
  styles: [`

    .survey-page {
      min-height: 100vh;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 20px;
      background: #f5f7fb;
    }

    .survey-card {
      width: 100%;
      max-width: 600px;
      padding: 40px;
      text-align: center;
      border-radius: 20px;
    }

    .brand {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 8px;
      font-size: 22px;
      font-weight: 600;
    }

    .hero-icon {
      margin: 35px auto 20px;
    }

    .hero-icon mat-icon {
      font-size: 60px;
      width: 60px;
      height: 60px;
    }

    h1 {
      font-size: 30px;
      margin-bottom: 15px;
    }

    .description {
      color: #666;
      line-height: 1.6;
      font-size: 16px;
    }

    .info-row {
      display: flex;
      justify-content: center;
      gap: 40px;
      margin: 30px 0;
    }

    .info-row div {
      display: flex;
      align-items: center;
      gap: 8px;
      color: #555;
    }

    .start-button {
      width: 100%;
      height: 50px;
      font-size: 16px;
    }

    .privacy {
      font-size: 12px;
      color: #888;
      margin-top: 20px;
    }

    @media(max-width: 600px) {
      .survey-card {
        padding: 25px 20px;
      }

      h1 {
        font-size: 24px;
      }

      .info-row {
        gap: 15px;
        flex-direction: column;
      }
    }

  `]
})
export class WelcomeComponent {
  private route = inject(ActivatedRoute);

  secuirtytoken = '';
  respondenttoken = '';
  surveyId = '';
  respondentId = '';

  constructor(private router: Router) { }

  startSurvey() {
    this.router.navigateByUrl('/survey/eligibility?token=' + this.respondenttoken);
  }



  ngOnInit() {

    this.route.queryParamMap.subscribe(params => {
      this.respondenttoken = params.get('token') ?? '';
    });

    if (!this.respondenttoken) {
      this.router.navigate(['/']);
    }
  }
}