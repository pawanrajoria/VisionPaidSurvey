import { Routes } from '@angular/router';
import { RootHomeComponent } from './root-home.component';

export const rootHomeRoutes: Routes = [
  {
    path: '',
    component: RootHomeComponent,
    pathMatch: 'full',
    data: {
      title: 'ProfitPiller | Earn Money with Paid Surveys & Rewards',
      description:
        'Join ProfitPiller (also searched as Profit Piller or ProfitPillar) to earn money online through paid surveys, offers, and rewards. Fast payouts via PayPal, gift cards, and more.',
      keywords: [
        'profitpiller',
        'profit piller',
        'profitpillar',
        'earn money online',
        'paid surveys india',
        'survey earning app',
        'make money with surveys',
        'online rewards platform',
        'get paid for opinions'
      ],
      canonical: 'https://www.profitpiller.com/',
      breadcrumb: [
        { label: 'Home', url: '/' }
      ]
    }
  }
];