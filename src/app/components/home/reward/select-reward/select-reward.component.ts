import { Component, OnInit } from "@angular/core";
import { MatDialogRef } from "@angular/material/dialog";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { SharedModule } from "../../../../shared.module";
import { IRewardInfoVM, UserWithdrawalRequestVM } from "../reward.vm";
import { RewardService } from "../reward.service";
import { MessageService } from "../../../layout/message/message.service";
import { MessageVM } from "../../../layout/message/message.vm";

@Component({
    selector: 'app-select-reward',
    imports: [SharedModule],
    templateUrl: './select-reward.component.html',
    styleUrls: ['./select-reward.component.scss'],
    animations: [
        trigger('cardFade', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.95)' }),
                animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' }))
            ])
        ])
    ]
})
export class SelectRewardComponent implements OnInit {
    searchText = '';
    selectedAmount: any = null;
    selectedData: any = null;

    rewardInfo: IRewardInfoVM = { giftCards: [], transferCards: [] };

    constructor(private rewardService: RewardService, private messageService: MessageService) {
    }

    async ngOnInit() {
        const response = await this.rewardService.bindRewardInfo({});
        if (!!response && response.isSuccess) {
            this.rewardInfo.giftCards = response.data.filter((p: any) => p.typeId == 2);
            this.rewardInfo.transferCards = response.data.filter((p: any) => p.typeId == 1);
        }
    }

    selectAmount(data: any, mainData: any) {
        this.selectedData = mainData;
        this.selectedAmount = data.amount;
    }

    async onSelectReward() {
        const self = this;

        const request: UserWithdrawalRequestVM = {
            method: self.selectedData.typeId,
            point: self.selectedAmount,
            giftCardId: self.selectedData.productId,
            giftCardName: self.selectedData.Name,
            emailId: "",
            giftCardImage: self.selectedData.imageUrl,
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