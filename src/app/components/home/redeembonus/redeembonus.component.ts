import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { ReferalService } from "../referal/referal.service";
import { MessageService } from "../../layout/message/message.service";
import { MessageVM } from "../../layout/message/message.vm";
import { BaseComponent } from "../../../base.component";

@Component({
    selector: 'app-redeembonus',
    imports: [SharedModule],
    templateUrl: './redeembonus.component.html',
    styleUrls: ['./redeembonus.component.scss']
})
export class RedeemBonusComponent extends BaseComponent implements OnInit {
    bonusCode: string = "";

    readonly steps = [
        { n: 1, icon: 'confirmation_number' },
        { n: 2, icon: 'edit_note' },
        { n: 3, icon: 'trending_up' }
    ];

    /** Where the bonus pays off - the 10% applies to surveys and offers completed in the next 24 hours. */
    readonly actions = [
        { key: 'use_surveys', icon: 'assignment', route: 'survey', color: '#105749' },
        { key: 'use_offers', icon: 'sports_esports', route: 'offers', color: '#7c3aed' },
        { key: 'use_streak', icon: 'local_fire_department', route: 'leaderboard', color: '#ea580c' },
        { key: 'use_cashout', icon: 'account_balance_wallet', route: 'cashout', color: '#0369a1' }
    ];
    constructor(private referalService: ReferalService, private messageService: MessageService) {
        super();
    }

    async ngOnInit() {
    }

    async redeemBonus() {
        const self = this;
        if (!self.bonusCode) return;

        const response = await self.referalService.referFriend({ referCode: self.bonusCode });
        if (!!response && response.isSuccess) {
            self.messageService.showMessage(new MessageVM(response.message, "success"));
        }
        else {
            self.messageService.showMessage(new MessageVM(response.message, "error"));
        }
    }
}