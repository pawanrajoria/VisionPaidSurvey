import { Routes } from "@angular/router";
import { RootTermConditionComponent } from "./root-termcondition.component";

export const rootTermConditionRoutes: Routes = [
  {
    path: '',
    component: RootTermConditionComponent,
    data: {
      // Neutral, policy-compliant metadata
      title: 'Terms & Conditions | Profitpiller',
      description: 'Review the Terms & Conditions for using Profitpiller. Learn about your rights, responsibilities, and how the platform operates.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Terms & Conditions', url: '/terms-conditions' } // internal URL
      ]
    }
  }
];
