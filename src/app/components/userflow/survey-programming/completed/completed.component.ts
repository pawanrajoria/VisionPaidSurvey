import { Component, Inject, PLATFORM_ID } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { Router } from '@angular/router';

import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BaseComponent } from '../../../../base.component';
import { RespondentEndSurveyResponseVM, RespondentEndSurveyVM } from '../../respondent.vm';
import { RespondentService } from '../../respondent.service';
import { HelperService } from '../../helper.service';
import { LocalStorageService } from '../../../../localstorage.service';
import { MatProgressSpinner } from "@angular/material/progress-spinner";

@Component({
  selector: 'app-survey-completed',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinner
],
  template: `

   <div class="completed-container">

  <mat-card class="completed-card">

    <div class="success-icon">
      <mat-icon>check_circle</mat-icon>
    </div>

    <h1>Thank You!</h1>

    <p>
      Your survey responses have been successfully submitted.
    </p>

    <div class="panel-box">

      <h2>Want to participate in more research?</h2>

      <p>
        Join ProfitPiller and receive opportunities to
        participate in additional research surveys and
        earn rewards for eligible participation.
      </p>

      <button
        mat-flat-button
        color="primary"
        class="join-button"
        [disabled]="isLoading"
        (click)="joinProfitPiller()">

        <mat-spinner
          *ngIf="isLoading"
          diameter="20">
        </mat-spinner>

        <span *ngIf="!isLoading">
          Join ProfitPiller
          <mat-icon>arrow_forward</mat-icon>
        </span>

        <span *ngIf="isLoading">
          Redirecting...
        </span>

      </button>

    </div>

    <button
      mat-button
      [disabled]="isLoading"
      (click)="finish()">

      Finish

    </button>

  </mat-card>

</div>
  `,

  styles: [`

    .completed-container {
      min-height: 100vh;
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 20px;
      background: #f5f7fb;
    }

    .completed-card {
      width: 100%;
      max-width: 600px;
      padding: 40px;
      text-align: center;
      border-radius: 20px;
    }

    .success-icon mat-icon {
      font-size: 70px;
      width: 70px;
      height: 70px;
    }

    h1 {
      font-size: 32px;
    }

    .panel-box {
      margin-top: 30px;
      padding: 25px;
      border-radius: 15px;
      background: #f7f8fc;
    }

    .panel-box p {
      line-height: 1.6;
      color: #666;
    }

    .join-button {
      width: 100%;
      height: 50px;
      margin-top: 15px;
    }

  `]
})
export class CompletedComponent extends BaseComponent {

  redirectLink:string="";
  isLoading=false;

  constructor(private respondentService: RespondentService, private helperService: HelperService,
    private localStorageService: LocalStorageService
  ) {
    super();
    this.completeSurvey();
  }

  openChat() {

  }

  async completeSurvey() {
    const self = this;
    if (!this.localStorageService.getItem('LandedUrl'))
      return;

    self.isLoading=true;

    const duid = await this.helperService.getOrInitializeDuid();

    let landedUrl: string = this.localStorageService.getItem('LandedUrl') ?? '';
    if (!!this.win && landedUrl.length != this.win.location.href.length) {
      landedUrl = this.win.location.href;
    }


    const request: RespondentEndSurveyVM = {
      requestUrl: landedUrl,
      duid: duid ?? '',
    };

    if (request.requestUrl.indexOf("/") >= 0) {
      request.requestUrl = request.requestUrl.replace("/#/", "/");
    }

    const ourputUrl: RespondentEndSurveyResponseVM = await self.respondentService.completeRespondent(request);
    if (!!ourputUrl && !!ourputUrl.requestUrl) {
      if (this.win) {
        this.redirectLink = ourputUrl.requestUrl;
      }
    }
    
    self.isLoading=false;
  }


  joinProfitPiller(): void {
    if (!!this.win) {
      window.location.href = 'https://profitpiller.com/auth/login';
    }
  }

  finish(): void {
    if (!!this.win) {
      window.close();
    }
  }
}