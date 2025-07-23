import { Component, EventEmitter, OnInit, Output } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { HelpService } from "../help.service";
import { MessageService } from "../../../layout/message/message.service";
import { MessageVM } from "../../../layout/message/message.vm";

@Component({
    selector: 'app-ask-question',
    imports: [SharedModule],
    templateUrl: './ask-question.component.html',
    styleUrls: ['./ask-question.component.scss']
})
export class AskQuestionComponent implements OnInit {
    @Output() gobackEvent = new EventEmitter<void>();
    questionForm: FormGroup;
    selectedFile: File | null = null;

    constructor(private fb: FormBuilder, private helpService: HelpService, private message: MessageService) {
        this.questionForm = this.fb.group({
            email: ['', [Validators.required, Validators.email]],
            message: ['', Validators.required],
        });
    }

    ngOnInit() {
    }

    onFileSelected(event: Event) {
        const input = event.target as HTMLInputElement;
        if (input?.files?.length) {
            const file = input.files[0];
            if (file.size <= 1024 * 1024) {
                this.selectedFile = file;
            } else {
                alert('File must be smaller than 1MB');
            }
        }
    }

    async onSubmit() {
        const self = this;
        if (!self.questionForm.valid) return;


        const formData = new FormData();
        formData.append('Body', self.questionForm.value.message);
        formData.append('ToEmail', self.questionForm.value.email);
        if (!!this.selectedFile) {
            formData.append('Attachment', this.selectedFile);
        }

        const response = await self.helpService.submitQuestion(formData)
        if (!!response && response.isSuccess) {
            self.message.showMessage(new MessageVM(response.message, "success"));
            self.questionForm.reset();
            self.selectedFile = null;
        }
        else {
            self.message.showMessage(new MessageVM(response.message, "error"));
        };
    }

    goBack() {
        this.gobackEvent.emit();
    }
}