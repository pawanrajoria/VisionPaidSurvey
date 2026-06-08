import { Component, OnInit } from "@angular/core";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { SharedModule } from "../../../../shared.module";
import { IGiftCardVM, IRewardInfoVM, UserWithdrawalRequestVM } from "../reward.vm";
import { RewardService } from "../reward.service";
import { MessageService } from "../../../layout/message/message.service";
import { MessageVM } from "../../../layout/message/message.vm";
import { PayoutMethodEnum } from "../reward.enum";
import { RedemptionDetailsComponent } from "../redemption-details/redemption-details.component";

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
    pagedGiftCards: IGiftCardVM[] = [];
    pageSize = 12; // 5 items per row * 3 rows
    pageIndex = 0;
    searchText = "";

    selectedCard: any = null;
    selectedChildOptionCard: any = null;
    selectedType: number = 0;
    showAllGiftCards = false;

    rewardInfo: IRewardInfoVM = { giftCards: [], transferCards: [] };


    constructor(private rewardService: RewardService, private messageService: MessageService, private dialog: MatDialog) {
    }

    async applyFilter() {
        await this.ngOnInit();
    }

    async ngOnInit() {
        const response = await this.rewardService.bindRewardInfo({ productName: this.searchText });
        if (!!response && response.isSuccess) {
            this.rewardInfo.giftCards = response.data.filter((p: any) => p.typeId == 2);
            this.rewardInfo.transferCards = response.data.filter((p: any) => p.typeId == 1 || p.typeId == 3);
            this.updatePagedGiftCards();
        }
    }

    viewMoreGiftCards() {
        this.showAllGiftCards = true;
        this.pageSize = this.rewardInfo.giftCards.length;
        this.pageIndex = 0;
        this.updatePagedGiftCards();
    }

    selectChilOption(option: any, event: MouseEvent, card: any, type: number) {
        event.stopPropagation();
        this.selectedChildOptionCard = option;
        this.selectedCard = card;
        this.selectedType = type;
    }

    get filteredGiftCards() {
        return this.pagedGiftCards?.filter(card =>
            !this.searchText || card.name?.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }

    updatePagedGiftCards() {
        if (this.showAllGiftCards) {
            this.pagedGiftCards = this.rewardInfo.giftCards;
        }

        const start = this.pageIndex * this.pageSize;
        const end = start + this.pageSize;
        this.pagedGiftCards = this.rewardInfo.giftCards.slice(start, end);
    }


    async onSelectReward() {
        const self = this;

        if (!self.selectedChildOptionCard)
            return;

        this.dialog.open(RedemptionDetailsComponent, {
            maxWidth: '100vw',
            panelClass: 'custom-dialog-container',
            data: {
                reward: this.selectedChildOptionCard,
                isPayPal: this.selectedChildOptionCard.productName == 'Paypal'
            }
        });

    }


    // async onSelectReward() {
    //     if (this.selectedType == 1) {
    //         this.redeemPayPal(this.selectedChildOptionCard, this.selectedCard);
    //     }
    //     else if (this.selectedType == 2) {
    //         this.redeemGift(this.selectedChildOptionCard, this.selectedCard);
    //     }
    // }


    // async redeemGift(option: any, giftCard: any) {
    //     const self = this;

    //     const request: UserWithdrawalRequestVM = {
    //         method: PayoutMethodEnum.GiftCard,
    //         point: option.points,
    //         giftCardId: giftCard.productId,
    //         giftCardName: giftCard.name,
    //         emailId: "",
    //         giftCardImage: giftCard.imageUrl,
    //     };
    //     const response = await self.rewardService.requestUserWithdrawal(request);
    //     if (!!response && !!response.isSuccess) {
    //         self.messageService.showMessage(new MessageVM(response.message, "success"));
    //     }
    //     else {
    //         self.messageService.showMessage(new MessageVM(response.message, "error"));
    //     }
    // }

    // async redeemPayPal(option: any, card: any) {
    //     const self = this;

    //     const request: UserWithdrawalRequestVM = {
    //         method: PayoutMethodEnum.PayPal,
    //         point: option.points,
    //         giftCardId: 0,
    //         giftCardName: card.name,
    //         emailId: "",
    //         giftCardImage: ""
    //     };
    //     const response = await self.rewardService.requestUserWithdrawal(request);
    //     if (!!response && !!response.isSuccess) {
    //         self.messageService.showMessage(new MessageVM(response.message, "success"));
    //     }
    //     else {
    //         self.messageService.showMessage(new MessageVM(response.message, "error"));
    //     }
    // }
}