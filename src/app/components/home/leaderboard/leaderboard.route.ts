import { Routes } from "@angular/router";
import { LeaderboardComponent } from "./leaderboard.component";

export const LeaderboardRoutes: Routes = [
  {
    path: '',
    component: LeaderboardComponent,
    data: {
      title: 'Leaderboard Page',
      urls: [
        { title: 'Leaderboard', url: '/leaderboard' },
        { title: 'Leaderboard Page' },
      ],
    },
  },
];
