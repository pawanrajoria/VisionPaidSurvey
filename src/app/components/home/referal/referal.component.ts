import { Component, OnInit, inject } from '@angular/core';
import { SharedModule } from '../../../shared.module';
import { ReferalService } from './referal.service';
import { IReferalVM } from './referal.vm';
import { MatDialog } from '@angular/material/dialog';
import { ReferalPopupComponent } from './referal-popup/referal-popup.component';
import { BaseComponent } from '../../../base.component';

@Component({
  selector: 'app-referal',
  standalone: true,
  imports: [SharedModule],
  templateUrl: './referal.component.html',
  styleUrls: ['./referal.component.scss']
})
export class ReferalComponent extends BaseComponent implements OnInit {
  referDetails: IReferalVM = {
    referCode: '',
    totalEarning: 0,
    totalUser: 0,
    referLinkCode: ''
  };

  steps = [
    {
      number: 1,
      title: 'Invite your friends',
      description: 'Tell your friends about Profit Piller and share it on Social Media'
    },
    {
      number: 2,
      title: 'Share your bonus code',
      description: 'New users that redeem your bonus code within 24 hours after signing up become your referral and get a 10% bonus for 24 hours'
    },
    {
      number: 3,
      title: 'Receive your commission',
      description: 'Earn 10% commission on your friends\' income for all surveys they complete. Your friends\' income remains the same!'
    }
  ];

  readonly dialog = inject(MatDialog);
  readonly referalService = inject(ReferalService);

  constructor() {
    super(); // bind browser globals
  }

  async ngOnInit(): Promise<void> {
    await this.getReferalInfo();
  }

  async getReferalInfo(): Promise<void> {
    this.referDetails = await this.referalService.getReferInfo();
  }

  copyCode(): void {
    if (this.isBrowser && this.win?.navigator?.clipboard) {
      this.win.navigator.clipboard.writeText(this.referDetails.referCode);
    }
  }

  copyLink(): void {
    this.dialog.open(ReferalPopupComponent, {
      maxWidth: '100vw',
      panelClass: 'custom-dialog-container',
      data: this.referDetails
    });
  }
}
