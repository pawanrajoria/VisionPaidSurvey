import { Component, inject, OnInit, signal } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { COUNTRY_LANGUAGE_LIST } from "../../root/root-header/country-languages.const";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "../message/message.service";
import { MessageVM } from "../message/message.vm";

@Component({
    selector: 'app-translate',
    imports: [SharedModule],
    templateUrl: './translator.component.html',
    styleUrls: ['./translator.component.scss']
})
export class TranslateComponent implements OnInit {
    countryLanguages = COUNTRY_LANGUAGE_LIST;
    selectedLanguageId: number | null = null;
    selectedLanguageCode: string = '';


    readonly dialog = inject(MatDialog);
    readonly panelOpenState = signal(false);

    constructor(private translate: TranslateService,
        private messageService: MessageService
    ) {
        // super();
    }


    async ngOnInit() {
    }



    onLanguageSelect(langCode: string, langId: number) {
        this.selectedLanguageCode = langCode;
        this.selectedLanguageId = langId;
    }

    changeLanguage() {
        if (!this.selectedLanguageCode) {
            this.messageService.showMessage(new MessageVM("Please select a language", "success"));
            return;
        }

        this.translate.use(this.selectedLanguageCode); // switch language
        this.dialog.closeAll();
    }

    closeTranslate() {
        this.dialog.closeAll();
    }

}