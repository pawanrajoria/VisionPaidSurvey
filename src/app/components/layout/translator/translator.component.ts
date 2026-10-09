import { Component, inject, OnInit, signal } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { COUNTRY_LANGUAGE_LIST } from "../../root/root-header/country-languages.const";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from "@ngx-translate/core";
import { MessageService } from "../message/message.service";
import { MessageVM } from "../message/message.vm";

/** Country + language picked last, so the picker re-opens on them. */
const PICKED_KEY = 'picked_country_language';

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
    /** Country whose panel is open and ticked when the picker opens (the last one chosen). */
    selectedCountryId: number | null = null;
    currentLanguageName = '';


    readonly dialog = inject(MatDialog);
    readonly panelOpenState = signal(false);

    constructor(private translate: TranslateService,
        private messageService: MessageService
    ) {
        // super();
    }


    async ngOnInit() {
        // Re-opening the picker shows what is in use: the saved country + language, or failing
        // that the first country offering the language the site is shown in.
        const current = this.translate.currentLang || this.translate.getDefaultLang() || 'en';
        let saved: { countryId: number; languageId: number; code: string } | null = null;
        try { saved = JSON.parse(localStorage.getItem(PICKED_KEY) ?? 'null'); } catch { saved = null; }

        const country = (saved && saved.code === current && this.countryLanguages.find(c => c.id === saved!.countryId))
            || this.countryLanguages.find(c => c.languages.some(l => l.code === current));
        const lang = country?.languages.find(l => l.code === current);
        if (country && lang) {
            this.selectedCountryId = country.id;
            this.selectedLanguageId = lang.id;
            this.selectedLanguageCode = lang.code;
            this.currentLanguageName = `${lang.name} (${country.countryName})`;
            // Its panel (open, language ticked) goes first so it is visible straight away.
            this.countryLanguages = [country, ...this.countryLanguages.filter(c => c.id !== country.id)];
        }
    }



    onLanguageSelect(langCode: string, langId: number, countryId: number) {
        this.selectedLanguageCode = langCode;
        this.selectedLanguageId = langId;
        this.selectedCountryId = countryId;
    }

    changeLanguage() {
        if (!this.selectedLanguageCode) {
            this.messageService.showMessage(new MessageVM("Please select a language", "success"));
            return;
        }

        this.translate.use(this.selectedLanguageCode); // switch language
        try {
            localStorage.setItem(PICKED_KEY, JSON.stringify({ countryId: this.selectedCountryId, languageId: this.selectedLanguageId, code: this.selectedLanguageCode }));
        } catch { /* storage blocked */ }
        this.dialog.closeAll();
    }

    closeTranslate() {
        this.dialog.closeAll();
    }

}