import { Routes } from '@angular/router';
import { InstructionComponent } from './instruction.component';

export const InstructionRoutes: Routes = [
  {
    path: '',
    component: InstructionComponent,
    data: {
      title: 'Platform Rules & Guidelines | ProfitPiller',
      description:
        'Read and accept ProfitPiller platform rules before participating in surveys. Ensure compliance to earn rewards safely and avoid account restrictions.',
      keywords: [
        'ProfitPiller rules',
        'survey guidelines',
        'earn money rules',
        'survey platform terms',
        'user instructions'
      ],
      noIndex: true, // ✅ Important: this page should not rank in SEO
      breadcrumb: [
        { label: 'Home', url: '/' },
        { label: 'Instructions' }
      ]
    }
  }
];