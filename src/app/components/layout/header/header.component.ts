import {
  Component,
  Output,
  EventEmitter,
  Input,
  ViewEncapsulation,
  inject,
  Inject,
  PLATFORM_ID,
  ViewChild,
  TemplateRef,
} from '@angular/core';
import { NgScrollbarModule } from 'ngx-scrollbar';
import { SharedModule } from '../../../shared.module';
import { AuthService } from '../../auth/auth.service';
import { AccountService } from '../../home/account.service';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { SelectRewardComponent } from '../../home/reward/select-reward/select-reward.component';
import { TierAwardComponent } from "./tier-award/tier-award.component";
import { RewardComponent } from '../../home/reward/reward.component';

@Component({
  selector: 'app-header',
  imports: [
    SharedModule,
    NgScrollbarModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class HeaderComponent {
  @Input() showToggle = true;
  @Input() toggleChecked = false;
  @Input() level: number = 1;
  @Input() status: string = '';
  @Input() reward?: string;
  @Input() notificationCount?: number;
  @Input() notificationHistory: any[] = [];

  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() removeNotification = new EventEmitter<void>();
  readonly dialog = inject(MatDialog);
  dialogRef: MatDialogRef<any> | null = null;
  @ViewChild('Qualify', { read: TemplateRef }) Qualify!: TemplateRef<any>;

  constructor(public authService: AuthService, private accountService: AccountService,
    private router: Router, private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId: any) {
  }


  get userBalanceInfo() {
    return this.accountService.getUserBalanceInfo();
  }

  get levelStatusColor(): string {
    switch (this.status.toLowerCase()) {
      case 'blue': return '#2196f3';
      case 'bronze': return '#cd7f32';
      case 'silver': return '#c0c0c0';
      case 'gold': return '#ffd700';
      case 'diamond': return '#b9f2ff';
      default: return '#ccc';
    }
  }

  changeReward() {

    this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {
      // Close any open dialog before opening a new one
      if (this.dialogRef) {
        this.dialogRef.close();
      }

      const config = new MatDialogConfig();

      if (result.matches) {
        // Mobile
        config.width = '100vw';
        config.height = '100vh';
        config.maxWidth = '100vw';
        config.maxHeight = '100vh';
        config.panelClass = 'full-screen-dialog';
      } else {
        // Desktop
        config.width = '30vw';
        config.height = '100vh';
        config.maxWidth = '30vw';
        config.maxHeight = '100vh';
        config.position = { right: '0' };
        config.panelClass = 'slide-in-dialog';
      }

      this.dialogRef = this.dialog.open(RewardComponent, config);
    });


  }

  goToAccount() {
    this.router.navigate(['app/account']);
  }

  goToEarning() {
    this.router.navigate(['app/account/transactions/1']);
  }


  closeSurvey() {
    this.dialog.closeAll();
  }

  closeHappened() {
    this.dialog.closeAll();
  }

  openQualify() {
    this.dialog.open(this.Qualify);
  }

  closeQualify() {
    this.dialog.closeAll();
  }

  openLevels() {
    const dialofref = this.dialog.open(TierAwardComponent);
    dialofref.afterClosed().subscribe(async (result) => {
      if (result === "submitForm") {
        dialofref.close();
      } else {
        dialofref.close();
      }
    });
  }

  closeQualification() {
    this.dialog.closeAll();
  }

  clearNotifications(event: MouseEvent) {
    event.stopPropagation(); // Prevents menu from closing immediately
    this.removeNotification.emit();
  }
}