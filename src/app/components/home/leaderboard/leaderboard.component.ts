import { Component, OnInit, OnDestroy, forwardRef } from "@angular/core";
import { timer, Subscription } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { SharedModule } from "../../../shared.module";
import { BaseComponent } from "../../../base.component";
import { EngagementService } from "../engagement/engagement.service";
import { ILeaderboard } from "../engagement/engagement.vm";

@Component({
  selector: 'app-leaderboard',
  imports: [SharedModule, forwardRef(() => FormatTimePipe)],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent extends BaseComponent implements OnInit, OnDestroy {
  board: ILeaderboard | null = null;
  loading = true;
  failed = false;

  /** Seconds until the weekly board resets (Monday 00:00 UTC). */
  counter = 0;
  private countDown: Subscription | undefined;

  constructor(private engagement: EngagementService) {
    super();
  }

  async ngOnInit() {
    this.board = await this.engagement.getLeaderboard();
    this.loading = false;
    this.failed = !this.board;

    if (this.board && this.isBrowser) {
      const end = new Date(this.board.weekEndUtc).getTime();
      const tick = () => this.counter = Math.max(0, Math.floor((end - Date.now()) / 1000));
      tick();
      this.countDown = timer(1000, 1000).subscribe(tick);
    }
  }

  ngOnDestroy(): void {
    this.countDown?.unsubscribe();
  }

  get progress(): number {
    const b = this.board;
    if (!b || b.threshold <= 0) return 100;
    return Math.min(100, Math.round((b.surveysCompleted / b.threshold) * 100));
  }
}

@Pipe({
  name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const days = Math.floor(value / 86400);
    const hours = Math.floor((value % 86400) / 3600);
    const minutes = Math.floor((value % 3600) / 60);
    const seconds = Math.floor(value % 60);
    const pad = (n: number) => ('00' + n).slice(-2);
    return (days > 0 ? days + 'd ' : '') + pad(hours) + 'h ' + pad(minutes) + 'm ' + pad(seconds) + 's';
  }
}
