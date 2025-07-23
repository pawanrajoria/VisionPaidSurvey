import { Component, OnInit, OnDestroy, forwardRef } from "@angular/core";
import { timer, Subscription } from 'rxjs';
import { Pipe, PipeTransform } from '@angular/core';
import { SharedModule } from "../../../shared.module";

@Component({
  selector: 'app-leaderboard',
  imports: [SharedModule, forwardRef(() => FormatTimePipe)],
  templateUrl: './leaderboard.component.html',
  styleUrls: ['./leaderboard.component.scss']
})
export class LeaderboardComponent implements OnInit, OnDestroy {
  ngOnDestroy(): void {
  }
  countDown: Subscription | undefined;
  counter = 9994400;
  tick = 1000;
  ngOnInit(): void {
    this.countDown = timer(0, this.tick).subscribe(() => --this.counter);
  }

}
@Pipe({
  name: 'formatTime',
})
export class FormatTimePipe implements PipeTransform {
  transform(value: number): string {
    const minutes: number = Math.floor(value / 60);
    const hour: number = Math.floor(minutes / 60);
    const calculatedMinute = minutes - hour * 60;
    return (
      ('00' + hour).slice(-2) +
      'h ' +
      ('00' + calculatedMinute).slice(-2) +
      'm ' +
      ('00' + Math.floor(value - minutes * 60)).slice(-2) +
      's '
    );
  }
}