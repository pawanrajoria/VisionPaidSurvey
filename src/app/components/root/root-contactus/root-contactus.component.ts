import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { MessageService } from "../../layout/message/message.service";
import { MessageVM } from "../../layout/message/message.vm";
import { HelpService } from "../../home/help/help.service";

@Component({
    selector: 'app-root-contactus',
    imports: [SharedModule],
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
    constructor(private messageService: MessageService, private helpService: HelpService) {
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
                this.messageService.showMessage(new MessageVM("Thank you for contacting us! We will get back to you soon.", "success"));
                this.contact = { name: '', email: '', phone: '', message: '' };
            }
            else {
                this.messageService.showMessage(new MessageVM(response.message, "error"));
            };


        } else {
            this.messageService.showMessage(new MessageVM("Please fill in all required fields.", "error"));
        }
    }

    ngOnInit(): void {
    }
}