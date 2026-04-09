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