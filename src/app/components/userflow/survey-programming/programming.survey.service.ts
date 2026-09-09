import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ProgrammingSurveyResponse } from './programming.survey.models';
import { ConfigService } from '../../../config.service';

@Injectable({
  providedIn: 'root'
})
export class ProgrammingSurveyService {

  private apiUrl = '/api/survey';

  constructor(private http: HttpClient, private configService: ConfigService) { }

  saveResponse(data: ProgrammingSurveyResponse): Observable<any> {
    return this.http.post(`${this.apiUrl}/response`, data);
  }

  generateSessionId(): string {
    return crypto.randomUUID();
  }

  async captureSurveyResponse(request: any): Promise<any> {
    const self = this;
    return self.http.post<any>(self.configService.userflowEndpoint + "Respondent/CaptureSurveyResponse", request).toPromise();
  }
}