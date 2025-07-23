import { Routes } from "@angular/router";
import { RootTermConditionComponent } from "./root-termcondition.component";

export const rootTermConditionRoutes: Routes = [
  {
    path: '',
    component: RootTermConditionComponent,
    data: {
      title: 'Terms & Conditions | Profitpiller',
      description: 'Review the Terms & Conditions for using Profitpiller. Learn about your rights, responsibilities, and how our paid survey platform operates.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Terms & Conditions' }
      ]
    }
  }
];
