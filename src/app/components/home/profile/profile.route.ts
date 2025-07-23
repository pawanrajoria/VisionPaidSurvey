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
      title: 'My Account Dashboard | Profitpiller',
      description: 'View your Profitpiller account dashboard including earnings, profile info, and recent activity in one place.',
      urls: [
        { title: 'Dashboard', url: '/account' },
        { title: 'My Account' }
      ]
    }
  },
  {
    path: 'activity',
    component: UserActivityComponent,
    data: {
      title: 'User Activity | Track Surveys & Offers | Profitpiller',
      description: 'Track your overall activity on Profitpiller including completed surveys, offers, logins, and point redemptions.',
      urls: [
        { title: 'My Account', url: '/account' },
        { title: 'Activity Log' }
      ]
    }
  },
  {
    path: 'transactions/:id',
    component: PointActivityComponent,
    data: {
      title: 'Transaction Details | Points Activity | Profitpiller',
      description: 'View detailed transaction history including points earned and redeemed from various activities.',
      urls: [
        { title: 'My Account', url: '/account' },
        { title: 'Transactions' }
      ]
    }
  },
  {
    path: 'surveyactivity',
    component: SurveyActivityComponent,
    data: {
      title: 'Survey Activity | Completed Surveys | Profitpiller',
      description: 'View a list of all completed surveys, including earnings and status updates for each submission.',
      urls: [
        { title: 'My Account', url: '/account' },
        { title: 'Survey Activity' }
      ]
    }
  },
  {
    path: 'offeractivity',
    component: OfferActivityComponent,
    data: {
      title: 'Offer Activity | Rewards & Tasks | Profitpiller',
      description: 'Monitor your completed offers and partner tasks along with reward status and payout amounts.',
      urls: [
        { title: 'My Account', url: '/account' },
        { title: 'Offer Activity' }
      ]
    }
  },
  {
    path: 'accountsettings',
    component: ProfileSettingComponent,
    data: {
      title: 'Account Settings | Update Profile | Profitpiller',
      description: 'Manage your Profitpiller account settings including email, password, demographics, and preferences.',
      urls: [
        { title: 'My Account', url: '/account' },
        { title: 'Account Settings' }
      ]
    }
  }
];
