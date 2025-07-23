import { afterNextRender, ChangeDetectorRef, Component, ElementRef, OnInit, signal, ViewChild } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { MatPaginator } from "@angular/material/paginator";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { RewardService } from "./reward.service";
import { ICommonCardVM, IGiftCardVM, IRewardInfoVM, UserWithdrawalRequestVM } from "./reward.vm";
import { PayoutMethodEnum } from "./reward.enum";
import { MessageService } from "../../layout/message/message.service";
import { MessageVM } from "../../layout/message/message.vm";

@Component({
    selector: 'app-reward',
    imports: [SharedModule],
    templateUrl: './reward.component.html',
    styleUrls: ['./reward.component.scss'],
    animations: [
        trigger('expandCollapse', [
            state('expanded', style({ height: '*', opacity: 1 })),
            state('collapsed', style({ height: '0px', opacity: 0 })),
            transition('expanded <=> collapsed', [
                animate('300ms ease-in-out')
            ])
        ])
    ]
})
export class RewardComponent {

    @ViewChild(MatPaginator) paginator!: MatPaginator;

    rewardInfo: IRewardInfoVM = { giftCards: [], transferCards: [] };

    pagedGiftCards: IGiftCardVM[] = [];
    pageSize = 12; // 5 items per row * 3 rows
    pageIndex = 0;
    searchText = "";

    selectedCard: any = null;
    selectedChildOptionCard: any = null;
    showAllGiftCards = false;

    constructor(private rewardService: RewardService, private messageService: MessageService) {
    }


    async applyFilter() {
        await this.ngOnInit();
    }

    async ngOnInit() {
        const response = await this.rewardService.bindRewardInfo({ productName: this.searchText });
        if (!!response && response.isSuccess) {
            this.rewardInfo.giftCards = response.data.filter((p: any) => p.typeId == 2);
            this.rewardInfo.transferCards = response.data.filter((p: any) => p.typeId == 1);
            this.updatePagedGiftCards();
        }

    }

    get filteredGiftCards() {
        return this.pagedGiftCards?.filter(card =>
            !this.searchText || card.name?.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }

    viewMoreGiftCards() {
        this.showAllGiftCards = true;
        this.pageSize = this.rewardInfo.giftCards.length;
        this.pageIndex = 0;
        this.updatePagedGiftCards();
    }

    selectChilOption(option: any, event: MouseEvent) {
        event.stopPropagation();
        this.selectedChildOptionCard = option;
    }

    toggleCard(card: ICommonCardVM) {
        if (this.selectedCard?.productId === card.productId) {
            this.selectedCard = null;
            this.selectedChildOptionCard = null; // <-- clear selected child
        } else {
            this.selectedCard = card;
            this.selectedChildOptionCard = null; // <-- clear selected child
        }
    }

    updatePagedGiftCards() {
        if (this.showAllGiftCards) {
            this.pagedGiftCards = this.rewardInfo.giftCards;
        }

        const start = this.pageIndex * this.pageSize;
        const end = start + this.pageSize;
        this.pagedGiftCards = this.rewardInfo.giftCards.slice(start, end);
    }

    async redeemGift(option: any, giftCard: any) {
        const self = this;

        const request: UserWithdrawalRequestVM = {
            method: PayoutMethodEnum.GiftCard,
            point: option.points,
            giftCardId: giftCard.productId,
            giftCardName: giftCard.name,
            emailId: "",
            giftCardImage: giftCard.imageUrl,
        };
        const response = await self.rewardService.requestUserWithdrawal(request);
        if (!!response && !!response.isSuccess) {
            self.messageService.showMessage(new MessageVM(response.message, "success"));
        }
        else {
            self.messageService.showMessage(new MessageVM(response.message, "error"));
        }
    }

    async redeemPayPal(option: any) {
        const self = this;

        const request: UserWithdrawalRequestVM = {
            method: PayoutMethodEnum.PayPal,
            point: option.points,
            giftCardId: 0,
            giftCardName: "PayPal International",
            emailId: "",
            giftCardImage: ""
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