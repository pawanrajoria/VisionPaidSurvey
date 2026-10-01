import {
    Component,
    inject
} from '@angular/core';
import { SharedModule } from '../../../../shared.module';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { AccountService } from '../../../home/account.service';
import { ITier, TIERS, tierForLevel } from '../../../home/engagement/engagement.vm';

@Component({
    selector: 'app-tier-award',
    imports: [
        SharedModule,
    ],
    templateUrl: './tier-award.component.html',
    styleUrls: ['./tier-award.component.scss']
})
export class TierAwardComponent {
    readonly tiers: ITier[] = TIERS;
    readonly dialog = inject(MatDialog);
    private readonly accountService = inject(AccountService);
    dialogRef: MatDialogRef<any> | null = null;

    get level(): number {
        return Math.max(1, Number(this.accountService.getUserBalanceInfo().userLevel) || 0);
    }

    get currentTier(): ITier {
        return tierForLevel(this.level);
    }

    range(tier: ITier): string {
        return tier.to === null ? `${tier.from}+` : `${tier.from}-${tier.to}`;
    }

    closeLevels() {
        this.dialog.closeAll();
    }
}
