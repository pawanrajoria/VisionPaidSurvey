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
import { TranslateService } from "@ngx-translate/core";
import { CasoutFilterByNamePipe } from "./filterByName.pipe";
import { AccountService } from "../account.service";
import { EngagementService } from "../engagement/engagement.service";
import { ICashoutRule } from "../engagement/engagement.vm";

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
    selectedCategory: any = null;

    skeletonArray = [1, 2];

    private rewardService = inject(RewardService);
    private snackBar = inject(MatSnackBar);
    private translate = inject(TranslateService);
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


    private engagement = inject(EngagementService);

    /** First-cashout rule from the API (the first withdrawal has a higher minimum). */
    cashoutRule: ICashoutRule | null = null;

    /** Points needed for the first cashout, or 0 when the rule does not apply to this user. */
    get firstCashoutMinPoints(): number {
        const r = this.cashoutRule;
        if (!r) return 0;
        return Math.max(r.minimumPoints ?? 0, r.isFirstCashout ? r.firstMinimumPoints : 0);
    }

    /** USD of the minimum above (every cashout, and the first one if it is higher). */
    get cashoutMinUsd(): number {
        const r = this.cashoutRule;
        if (!r) return 0;
        return Math.max(r.minimumUsd ?? 0, r.isFirstCashout ? r.firstMinimumUsd : 0);
    }

    async ngOnInit() {
        this.isLoading = true;
        this.engagement.getSummary().then(summary => this.cashoutRule = summary?.cashout ?? null);
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
                    .sort((a, b) => a.minPoints - b.minPoints)
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

    /** '' = every category, otherwise a category name (chips above the grid). */
    activeCategory = '';

    get balance(): number {
        return Number(this.userBalanceInfo.balance ?? 0) || 0;
    }

    get visibleCategories(): RewardCategory[] {
        return this.allRewards.filter(c => c.items.length > 0 && (!this.activeCategory || c.name === this.activeCategory));
    }

    minPoints(item: any): number {
        const points = (item.options ?? []).map((o: any) => Number(o.points) || 0).filter((p: number) => p > 0);
        return points.length ? Math.min(...points) : 0;
    }

    canAfford(item: any): boolean {
        const min = this.minPoints(item);
        return min > 0 && this.balance >= Math.max(min, this.firstCashoutMinPoints);
    }

    /** Points of the cheapest reward the user can claim (the first cash out may have a higher minimum). */
    get cheapestPoints(): number {
        const all = this.allRewards.flatMap(c => c.items).map(i => this.minPoints(i)).filter(p => p > 0);
        if (!all.length) return 0;
        return Math.max(Math.min(...all), this.firstCashoutMinPoints);
    }

    get goalPercent(): number {
        const goal = this.cheapestPoints;
        return goal > 0 ? Math.min(100, Math.round(this.balance * 100 / goal)) : 0;
    }

    /** Logos that failed to load show the first letter instead. */
    brokenImages: Record<number, boolean> = {};

    /**
     * The method whose amounts are shown: the one picked, or - until the user picks one - the first
     * they can afford (the balance arrives after the page, so this cannot be decided once on load).
     */
    get activeItem(): any {
        if (this.selectedCategory) return this.selectedCategory;
        return this.allRewards.flatMap(c => c.items).find(i => this.canAfford(i)) ?? null;
    }

    selectItem(item: any) {
        if (this.activeItem?.id !== item.id || !this.selectedCategory) {
            this.selectedCategory = item;
            this.selectedRewardCategory = undefined as any;
        }
        // Phones: the amounts are below the grid.
        if (this.isBrowser()) setTimeout(() => document.querySelector('.picker')?.scrollIntoView({ behavior: 'smooth', block: 'nearest' }));
    }

    private isBrowser(): boolean {
        return typeof document !== 'undefined';
    }

    closeModal() {
        this.dialogRef?.close(null);
    }

    async handleRewardClick(option: any, item: any) {
        // The API enforces this too; checking here saves the user a failed request.
        if (this.firstCashoutMinPoints > 0 && Number(option.points) < this.firstCashoutMinPoints) {
            this.snackBar.open(
                this.translate.instant('app.cashout.minNote', { usd: this.cashoutMinUsd, points: this.firstCashoutMinPoints }),
                'OK',
                { duration: 5000, verticalPosition: 'bottom' }
            );
            return;
        }

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