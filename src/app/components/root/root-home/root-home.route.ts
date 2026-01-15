import { Routes } from "@angular/router";
import { RootHomeComponent } from "./root-home.component";

export const rootHomeRoutes: Routes = [
  {
    path: '',
    component: RootHomeComponent,
    data: {
      title: 'Profitpiller | Online Opinion Research Platform',
      description:
        'Profitpiller is an online opinion research platform where users can participate in surveys and research studies.',
      urls: [
        { title: 'Home' }
      ]
    }
  }
];
