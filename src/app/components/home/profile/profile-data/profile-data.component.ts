import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../../shared.module";
import { ProfileService } from "../profile.service";
import { BaseComponent } from "../../../../base.component";
import { Iso639Map } from "../../../../supporteslanguage";
import { IProfileQuestionAnswerDetailsDtos, IProfileQuestionDetailsDtos, IProfileQuestionDtos } from "./profile-data.vm";
import { SearchQuestionPipe } from "../../../userflow/search.pipe";
import { Router } from "@angular/router";
import { MessageService } from "../../../layout/message/message.service";
import { MessageVM } from "../../../layout/message/message.vm";

@Component({
    selector: 'app-profile-data',
    imports: [SharedModule, SearchQuestionPipe],
    templateUrl: './profile-data.component.html',
    styleUrls: ['./profile-data.component.scss']
})
export class ProfileDataComponent extends BaseComponent implements OnInit {

    currentView: 'categories' | 'questions' | 'detail' = 'categories';
    searchText: string = '';

    activeCategory: IProfileQuestionDtos | null = null;
    activeQuestion!: IProfileQuestionDetailsDtos;

    data: IProfileQuestionDtos[] = [];

    constructor(private profileService: ProfileService, private router: Router,
        private messageService: MessageService
    ) {
        super();
    }

    async ngOnInit() {
        await this.getQualifications();
    }

    selectCategory(cat: IProfileQuestionDtos) {
        this.activeCategory = cat;
        this.currentView = 'questions';
    }

    showQuestion(q: IProfileQuestionDetailsDtos) {
        this.activeQuestion = q;
        this.currentView = 'detail';
    }

    onRadioChange(answer: IProfileQuestionAnswerDetailsDtos) {
        if (!this.activeQuestion) return;

        this.activeQuestion.answers.forEach(a => a.isSelected = false);
        answer.isSelected = true;
    }

    onCheckboxChange(answer: IProfileQuestionAnswerDetailsDtos) {
        answer.isSelected = !answer.isSelected;
    }

    isSubmitDisabled(): boolean {
        if (this.activeQuestion?.typeId === 8) {
            return !this.activeQuestion?.answers.some(a => a.answerText ?? 0 > 10);
        }
        else if (this.activeQuestion?.typeId === 10) {
            return !this.activeQuestion?.answers.some(a => !!a.answerText && a.answerText.toString().trim() != '');
        }
        return !this.activeQuestion?.answers.some(a => a.isSelected);
    }

    goBack() {
        this.searchText = '';
        if (this.currentView === 'detail') { this.currentView = 'questions'; }
        else if (this.currentView === 'questions') { this.currentView = 'categories'; this.activeCategory = null; }
        else {
            this.router.navigate(['/', this.currentLocale, 'app', 'account']);
        }
    }

    async submitAnswer() {
        if (!this.activeQuestion) return;

        let request: Array<IProfileQuestionAnswerDetailsDtos> = [];

        if (this.activeQuestion?.typeId === 10 || this.activeQuestion?.typeId === 8) {
            request = this.activeQuestion.answers;
            request.forEach(p => p.answerText = p.answerText?.toString().trim() ?? '');
        }
        else {
            request = this.activeQuestion.answers.filter(a => a.isSelected);
        }

        const response = await this.profileService.saveProfileQualification(request);
        if (!!response) {
            this.messageService.showMessage(new MessageVM("Profile updated successfully", "success"));
            await this.getQualifications();
        }

        this.currentView = 'questions';
    }

    getLang3(lang: string): string {
        const lang2 = lang.split('-')[0].toLowerCase();
        return Iso639Map[lang2] || "eng";
    }

    async getQualifications() {
        let lang3 = "eng";

        if (this.isBrowser && this.win) {
            lang3 = this.getLang3(navigator.language);
        }

        const response = await this.profileService.getprofileQualifications(lang3);
        this.data = response;
    }

    get filteredAnswers() {
        if (!this.activeQuestion || !this.activeQuestion.answers) return [];

        if (!this.searchText.trim()) {
            return this.activeQuestion.answers;
        }

        return this.activeQuestion.answers.filter((ans: any) =>
            ans.answerName.toLowerCase().includes(this.searchText.toLowerCase())
        );
    }
}