import { Component, Inject, Input } from '@angular/core';
import { MessageVM } from '../../../layout/message/message.vm';
import { MessageService } from '../../../layout/message/message.service';
import { UserWithdrawalRequestVM } from '../reward.vm';
import { PayoutMethodEnum } from '../reward.enum';
import { RewardService } from '../reward.service';
import { SharedModule } from '../../../../shared.module';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-redemption-details',
    templateUrl: './redemption-details.component.html',
    styleUrls: ['./redemption-details.component.scss'],
    imports: [SharedModule]
})
export class RedemptionDetailsComponent {
    

    constructor(private messageService: MessageService, private rewardService: RewardService,
        public dialogRef: MatDialogRef<RedemptionDetailsComponent>,
        @Inject(MAT_DIALOG_DATA) public reward: any
    ) { }

    closeModal() {
        this.dialogRef.close();
    }

    async confirmRedemption() {
        const self = this;

        if (self.reward.typeId == 3) {
            if (!self.reward.upiId || self.reward.upiId.trim() === '') {
                self.messageService.showMessage(new MessageVM("Please enter your UPI ID", "warning"));
                return;
            }
        } else {
            if (!self.reward.emailId || self.reward.emailId.trim() === '') {
                self.messageService.showMessage(new MessageVM("Please enter your Email ID", "warning"));
                return;
            }
        }

        const request: UserWithdrawalRequestVM = {
            method: self.reward.typeId == 1 ? PayoutMethodEnum.PayPal : self.reward.typeId == 3 ? PayoutMethodEnum.UPI : PayoutMethodEnum.GiftCard,
            point: self.reward.points,
            giftCardId: self.reward.productId,
            giftCardName: self.reward.productName,
            emailId: self.reward.emailId,
            giftCardImage: self.reward.imageUrl,
            typeId: self.reward.typeId,
            upiId: self.reward.upiId
        };
        const response = await self.rewardService.requestUserWithdrawal(request);
        if (!!response && !!response.isSuccess) {
            self.messageService.showMessage(new MessageVM(response.message, "success"));
        }
        else {
            self.messageService.showMessage(new MessageVM(response.message, "error"));
        }
    }
}