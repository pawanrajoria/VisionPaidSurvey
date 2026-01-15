import { Routes } from "@angular/router";
import { RootHelpComponent } from "./root-help.component";

export const rootHelpRoutes: Routes = [
  {
    path: '',
    component: RootHelpComponent,
    data: {
      // Neutral and policy-compliant metadata
      title: 'Help & FAQ | Profitpiller',
      description: 'Find answers to frequently asked questions about Profitpiller. Learn how the platform works, how to redeem points safely, and how to resolve common survey or account issues.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Help & FAQ', url: '/help' } // internal URL
      ]
    }
  }
];
