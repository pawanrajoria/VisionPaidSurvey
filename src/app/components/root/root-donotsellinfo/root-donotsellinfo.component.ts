import { Component, OnInit } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";
import { MessageService } from "../../layout/message/message.service";
import { HelpService } from "../../home/help/help.service";
import { MessageVM } from "../../layout/message/message.vm";

@Component({
    selector: 'app-root-donotsellinfo',
    imports: [PublicSharedModule],
    templateUrl: './root-donotsellinfo.component.html',
    styleUrls: ['./root-donotsellinfo.component.scss']
})
export class RootDoNotSellInfoComponent implements OnInit {

    securityForm = {
        name: '',
        email: '',
        message: ''
    };

    constructor(private messageService: MessageService, private helpService: HelpService) {
    }


    ngOnInit(): void {
    }

    async onSubmit() {
        if (this.securityForm.name && this.securityForm.email && this.securityForm.message) {
            const formData = new FormData();
            formData.append('Name', this.securityForm.name);
            formData.append('Email', this.securityForm.email);
            formData.append('Message', this.securityForm.message);

            const response = await this.helpService.submitDotNotSellInfo(formData)
            if (!!response && response.isSuccess) {
                this.messageService.showMessage(new MessageVM("Thank you for contacting us! We will get back to you soon.", "success"));
                this.securityForm = { name: '', email: '', message: '' };
            }
            else {
                this.messageService.showMessage(new MessageVM(response.message, "error"));
            };


        } else {
            this.messageService.showMessage(new MessageVM("Please fill in all required fields.", "error"));
        }
    }
}