import { Routes } from "@angular/router";
import { RootPuzzleDataDeletionComponent } from "./root-puzzle-datadeletion";

export const rootPuzzleDataDeletionRoutes: Routes = [
  {
    path: '',
    component: RootPuzzleDataDeletionComponent,
    data: {
      title: 'Delete Your Data | ProfitPiller Puzzle',
      description: 'How to ask for your ProfitPiller Puzzle data to be deleted, what is deleted and what is kept and for how long.',
      urls: [
        { title: 'Home', url: '/' },
        { title: 'Puzzle Data Deletion', url: '/puzzle-data-deletion' }
      ]
    }
  }
];
