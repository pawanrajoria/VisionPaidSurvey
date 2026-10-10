import { Component, OnInit } from "@angular/core";
import { TranslateService } from "@ngx-translate/core";
import { PublicSharedModule } from "../../../public-shared.module";
import { MessageService } from "../../layout/message/message.service";
import { MessageVM } from "../../layout/message/message.vm";
import { HelpService } from "../../home/help/help.service";

@Component({
    selector: 'app-root-contactus',
    imports: [PublicSharedModule],
    templateUrl: './root-contactus.component.html',
    styleUrls: ['./root-contactus.component.scss']
})
export class RootContactUsComponent implements OnInit {
    contact = {
        name: '',
        email: '',
        phone: '',
        message: ''
    };
    constructor(private messageService: MessageService, private helpService: HelpService,
        private translate: TranslateService) {
        // Initialize contact object if needed
    }


    async onSubmit() {
        if (this.contact.name && this.contact.email && this.contact.message) {

            const formData = new FormData();
            formData.append('Name', this.contact.name);
            formData.append('Email', this.contact.email);
            formData.append('Phone', this.contact.phone);
            formData.append('Message', this.contact.message);

            const response = await this.helpService.submitContactUs(formData)
            if (!!response && response.isSuccess) {
                this.messageService.showMessage(new MessageVM(this.translate.instant('app.contactForm.thanks'), "success"));
                this.contact = { name: '', email: '', phone: '', message: '' };
            }
            else {
                this.messageService.showMessage(new MessageVM(response.message, "error"));
            };


        } else {
            this.messageService.showMessage(new MessageVM(this.translate.instant('app.contactForm.required'), "error"));
        }
    }

    ngOnInit(): void {
    }
}