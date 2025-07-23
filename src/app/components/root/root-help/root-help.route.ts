import { Routes } from "@angular/router";
import { RootHelpComponent } from "./root-help.component";

export const rootHelpRoutes: Routes = [
  {
    path: '',
    component: RootHelpComponent,
    data: {
      title: 'Help & FAQ | How Profitpiller Surveys Work',
      description: 'Find answers to frequently asked questions about Profitpiller. Learn how to earn, redeem rewards, and resolve common survey or account issues.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Help & FAQ' }
      ]
    }
  }
];
