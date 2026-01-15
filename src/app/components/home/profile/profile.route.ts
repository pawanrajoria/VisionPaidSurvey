import { Routes } from "@angular/router";
import { ProfileComponent } from "./profile.component";
import { UserActivityComponent } from "./user-activity/user-activity.component";
import { ProfileSettingComponent } from "./profile-setting/profile-setting.component";
import { PointActivityComponent } from "./point-activity/point-activity.component";
import { SurveyActivityComponent } from "./survey-activity/survey-activity.component";
import { OfferActivityComponent } from "./offer-activity/offer-activity.component";

export const ProfileRoutes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    data: {
      title: 'My Account | Profitpiller',
      description:
        'Manage your account information and view your recent platform activity.',
      urls: [
        { title: 'My Account' }
      ]
    }
  },
  {
    path: 'activity',
    component: UserActivityComponent,
    data: {
      title: 'Account Activity | Profitpiller',
      description:
        'View your recent account activity and usage history on Profitpiller.',
      urls: [
        { title: 'My Account', url: '/account' },
        { title: 'Activity' }
      ]
    }
  },
  {
    path: 'transactions/:id',
    component: PointActivityComponent,
    data: {
      title: 'Account Records | Profitpiller',
      description:
        'View detailed account records related to your participation history.',
      urls: [
        { title: 'My Account', url: '/account' },
        { title: 'Records' }
      ]
    }
  },
  {
    path: 'surveyactivity',
    component: SurveyActivityComponent,
    data: {
      title: 'Survey Participation | Profitpiller',
      description:
        'Review your survey participation history on Profitpiller.',
      urls: [
        { title: 'My Account', url: '/account' },
        { title: 'Surveys' }
      ]
    }
  },
  {
    path: 'offeractivity',
    component: OfferActivityComponent,
    data: {
      title: 'Task Participation | Profitpiller',
      description:
        'Review your participation in available tasks and activities.',
      urls: [
        { title: 'My Account', url: '/account' },
        { title: 'Activities' }
      ]
    }
  },
  {
    path: 'accountsettings',
    component: ProfileSettingComponent,
    data: {
      title: 'Account Settings | Profitpiller',
      description:
        'Update your personal information, preferences, and security settings.',
      urls: [
        { title: 'My Account', url: '/account' },
        { title: 'Settings' }
      ]
    }
  }
];
