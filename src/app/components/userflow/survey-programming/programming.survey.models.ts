export interface ProgrammingSurveyResponse {
  sessionId: string;
  source?: string;
  campaignId?: string;

  country?: string;
  age?: number;
  gender?: string;
  employment?: string;
  education?: string;

  surveyFrequency?: string;
  rewardPreference?: string;
  surveyAppUsage?: string;

  onlineShopping?: string;
  smartphone?: boolean;
  desktop?: boolean;
  tablet?: boolean;

  interestedInPanel?: boolean;
}