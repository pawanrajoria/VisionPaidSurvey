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
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { EngagementService } from '../../home/engagement/engagement.service';
import { IEngagementSummary } from '../../home/engagement/engagement.vm';
import { MessageService } from '../message/message.service';
import { MessageVM } from '../message/message.vm';
import { SUPPORTED_LOCALE_CODES } from '../../../country-langiuage-list';
import { SelectRewardComponent } from '../../home/reward/select-reward/select-reward.component';
import { TierAwardComponent } from "./tier-award/tier-award.component";
import { RewardComponent } from '../../home/reward/reward.component';
import { AdminService } from '../../admin/admin.service';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-header',
  imports: [
    SharedModule,
    NgScrollbarModule
  ],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss', './header-engagement.scss'],
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
  /** A listed notification was clicked; carries its link (may be empty). */
  @Output() openNotification = new EventEmitter<string>();
  readonly dialog = inject(MatDialog);
  dialogRef: MatDialogRef<any> | null = null;
  isAdmin = false;
  @ViewChild('Qualify', { read: TemplateRef }) Qualify!: TemplateRef<any>;

  constructor(public authService: AuthService, private accountService: AccountService,
    private router: Router, private breakpointObserver: BreakpointObserver,
    @Inject(PLATFORM_ID) private platformId: any) {
    // Shows the "Admin console" entry only to accounts the API recognises as administrators.
    if (isPlatformBrowser(this.platformId)) {
      inject(AdminService).isAdmin().then(value => this.isAdmin = value);

      // The summary is cached by the service, so re-reading it on every navigation is free
      // and picks up changes made elsewhere (welcome bonus claimed, cache cleared).
      this.loadEngagement();
      this.router.events
        .pipe(filter(e => e instanceof NavigationEnd), takeUntilDestroyed())
        .subscribe(() => this.loadEngagement());
    }
  }

  // ───────────── Streak, daily check-in and getting-started pills ─────────────
  private readonly engagement = inject(EngagementService);
  private readonly messageService = inject(MessageService);
  private readonly route = inject(ActivatedRoute);
  private sheetRef: MatDialogRef<unknown> | null = null;

  summary: IEngagementSummary | null = null;
  claimingDaily = false;
  drawing = false;

  get currentLocale(): string {
    let current: ActivatedRoute | null = this.route;
    while (current) {
      const locale = current.snapshot.paramMap.get('locale');
      if (locale && SUPPORTED_LOCALE_CODES.has(locale.toLowerCase())) return locale.toLowerCase();
      current = current.parent;
    }
    const fromUrl = this.router.url.split('/')[1]?.toLowerCase();
    return fromUrl && SUPPORTED_LOCALE_CODES.has(fromUrl) ? fromUrl : 'en-us';
  }

  async loadEngagement(refresh = false) {
    this.summary = await this.engagement.getSummary(refresh);
  }

  /** Opens one of the engagement details: a bottom sheet on phones, a small dialog on larger screens. */
  openSheet(template: TemplateRef<unknown>) {
    this.sheetRef?.close();
    const phone = this.breakpointObserver.isMatched('(max-width: 600px)');
    this.sheetRef = this.dialog.open(template, {
      width: phone ? '100vw' : '440px',
      maxWidth: phone ? '100vw' : '94vw',
      maxHeight: '88vh',
      autoFocus: false,
      position: phone ? { bottom: '0' } : undefined,
      panelClass: phone ? ['engage-sheet-panel', 'engage-sheet-bottom'] : ['engage-sheet-panel']
    });
  }

  closeSheet() {
    this.sheetRef?.close();
    this.sheetRef = null;
  }

  /** Weekly streak prize draw. */
  async drawPrize() {
    if (this.drawing || !this.summary?.streak?.drawsAvailable) return;
    this.drawing = true;
    try {
      await this.afterBonus(await this.engagement.streakDraw());
    } catch {
      /* the interceptor already told the user */
    } finally {
      this.drawing = false;
    }
  }

  async claimDaily() {
    if (this.claimingDaily || !this.summary?.daily?.available || this.summary.daily.claimedToday) return;
    this.claimingDaily = true;
    try {
      await this.afterBonus(await this.engagement.dailyCheckin());
    } catch {
      /* the interceptor already told the user */
    } finally {
      this.claimingDaily = false;
    }
  }

  private async afterBonus(result: { message: string; isSuccess: boolean } | null) {
    this.messageService.showMessage(new MessageVM(result?.message ?? 'Done', result?.isSuccess ? 'success' : 'warn'));
    await this.loadEngagement(true);
    if (result?.isSuccess) {
      const info = await this.accountService.getuserinfo();
      if (info) this.accountService.setUserBalanceInfo(info);
    }
  }

  get streakDays(): number[] {
    const every = this.summary?.daily?.streakBonusEveryDays ?? 7;
    return Array.from({ length: every }, (_, i) => i + 1);
  }

  /** Position inside the current streak cycle (1..N), 0 when no streak is running. */
  get streakPosition(): number {
    const d = this.summary?.daily;
    if (!d || d.streak === 0) return 0;
    const mod = d.streak % d.streakBonusEveryDays;
    return mod === 0 ? d.streakBonusEveryDays : mod;
  }

  get checklist(): { label: string; done: boolean; link: string[] }[] {
    const c = this.summary?.checklist;
    if (!c) return [];
    const app = ['/', this.currentLocale, 'app'];
    const items = [
      { label: 'app.earn.checkProfile', done: c.profileCompleted, link: [...app, 'welcome'] },
      { label: 'app.earn.checkSurvey', done: c.firstSurveyDone, link: [...app, 'survey'] },
      { label: 'app.earn.checkOffer', done: c.firstOfferDone, link: [...app, 'offers'] },
      { label: 'app.earn.checkInvite', done: c.invitedFriend, link: [...app, 'refer'] },
      { label: 'app.earn.checkCashout', done: c.firstCashout, link: [...app, 'cashout'] }
    ];
    // The profile step only exists while the welcome bonus is switched on.
    return this.summary?.onboarding?.available ? items : items.slice(1);
  }

  get checklistDone(): number { return this.checklist.filter(i => i.done).length; }
  get showChecklist(): boolean { return this.checklist.length > 0 && this.checklistDone < this.checklist.length; }


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

  goToChat() {
    this.router.navigate(['app/chat']);
  }

  goToAdmin() {
    this.router.navigate(['admin']);
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