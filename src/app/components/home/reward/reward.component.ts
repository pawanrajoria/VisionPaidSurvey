import { afterNextRender, ChangeDetectorRef, Component, ElementRef, inject, OnInit, signal, ViewChild } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { MatPaginator } from "@angular/material/paginator";
import { animate, state, style, transition, trigger } from "@angular/animations";
import { RewardService } from "./reward.service";
import { ICommonCardVM, IGiftCardVM, IRewardInfoVM, RedemptionOption, RewardCategory, UserWithdrawalRequestVM } from "./reward.vm";
import { PayoutMethodEnum } from "./reward.enum";
import { MessageService } from "../../layout/message/message.service";
import { MessageVM } from "../../layout/message/message.vm";
import { RedemptionDetailsComponent } from "./redemption-details/redemption-details.component";
import { MatDialog, MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { CasoutFilterByNamePipe } from "./filterByName.pipe";
import { AccountService } from "../account.service";

@Component({
    selector: 'app-reward',
    imports: [SharedModule, CasoutFilterByNamePipe],
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
    searchText = '';
    allRewards: RewardCategory[] = [];
    rewardsCategories: RewardCategory[] = [];

    private itemsPerPage = 5;
    private currentPage = 0;
    isLoading = true;

    selectedRewardCategory!: RedemptionOption;
    selectedCategory!: RewardCategory;

    skeletonArray = [1, 2];

    private rewardService = inject(RewardService);
    private snackBar = inject(MatSnackBar);
    private dialog = inject(MatDialog);
    private accountService = inject(AccountService);

    dialogRef = inject(MatDialogRef<RewardComponent>, {
        optional: true
    });


    get userBalanceInfo() {
        return this.accountService.getUserBalanceInfo();
    }

    get isPopup(): boolean {
        return !!this.dialogRef;
    }


    async ngOnInit() {
        this.isLoading = true;
        const response = await this.rewardService.bindRewardInfo({
            productName: this.searchText
        });
        if (response?.isSuccess) {
            this.allRewards = this.processRewards(response.data);
            this.loadInitialItems();
        }
        this.isLoading = false;
    }

    private loadInitialItems() {
        this.currentPage = 1;
        this.rewardsCategories = this.paginateItems(1);
    }

    private paginateItems(page: number): RewardCategory[] {
        const limit = page * this.itemsPerPage;
        return this.allRewards.map(cat => ({
            ...cat,
            items: cat.items.slice(0, limit)
        }));
    }

    onScroll(event: Event) {
        const element = event.target as HTMLElement;
        const atBottom =
            element.scrollHeight - element.scrollTop <= element.clientHeight + 100;

        if (atBottom) {
            this.currentPage++;
            const nextItems = this.paginateItems(this.currentPage);
            this.rewardsCategories = nextItems;
        }
    }

    private processRewards(data: any[]): RewardCategory[] {
        return [
            {
                name: 'Transfer',
                count: data.filter(p => p.typeId == 1 || p.typeId == 3).length,
                icon: 'business',
                items: data
                    .filter(p => p.typeId == 1 || p.typeId == 3)
                    .map(card => this.mapCardToItem(card)),
                type: PayoutMethodEnum.PayPal,
            },
            {
                name: 'Gift Cards',
                count: data.filter(p => p.typeId == 2).length,
                icon: 'card_giftcard',
                items: data
                    .filter(p => p.typeId == 2)
                    .map(card => this.mapCardToItem(card)),
                type: PayoutMethodEnum.GiftCard
            }
        ];
    }

    private mapCardToItem(card: any) {
        return {
            id: card.productId,
            name: card.name,
            showAll: false,
            subText: `From ${card.minPoints} Points`,
            image: card.imageUrl ||
                'https://www.paypalobjects.com/webstatic/mktg/logo/pp_cc_mark_74x46.jpg',
            currencyCode: card.currencyCode,
            options: card.options.map((option: any) => ({
                productId: card.productId,
                productName: card.name,
                imageUrl: card.imageUrl,
                value: option.amount,
                points: option.points,
                typeId: card.typeId,
                isAvailable: (this.userBalanceInfo.balance ?? 0) >= option.points,
                emailId: card?.emailId || '',
                upiId: card?.upiId || '',
            }))
        };
    }

    closeModal() {
        this.dialogRef?.close(null);
    }

    async handleRewardClick(option: any, item: any) {
        if (option.points > (this.userBalanceInfo.balance ?? 0)) {
            this.snackBar.open(
                `${item.name} requires ${option.points} pts. You have ${this.userBalanceInfo.balance}.`,
                'OK',
                { duration: 2000, verticalPosition: 'bottom' }
            );
            return;
        }
        this.selectedRewardCategory = option;
        this.selectedCategory = item;
    }

    async onSelectReward() {
        if (!this.selectedRewardCategory) return;
        // this.dialogRef.close({
        //     reward: this.selectedRewardCategory,
        //     isPayPal: this.selectedRewardCategory.productName === 'Paypal'
        // });

        this.dialog.open(RedemptionDetailsComponent, {
            maxWidth: '100vw',
            panelClass: 'custom-dialog-container',
            data: this.selectedRewardCategory
        });
    }
}