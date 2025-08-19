import { Component, OnInit, HostListener, inject, ViewChild, TemplateRef, signal } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { Router } from "@angular/router";
import { BaseComponent } from "../../../base.component";
import { MatDialog } from "@angular/material/dialog";
import { TranslateService } from '@ngx-translate/core';
// Add the correct import for COUNTRY_LANGUAGE_LIST
import { COUNTRY_LANGUAGE_LIST } from "./country-languages.const";

import { MessageService } from "../../layout/message/message.service";
import { MessageVM } from "../../layout/message/message.vm";

@Component({
    selector: 'app-root-header',
    imports: [SharedModule],
    templateUrl: './root-header.component.html',
    styleUrls: ['./root-header.component.scss']
})
export class RootHeaderComponent extends BaseComponent implements OnInit {
    @ViewChild('Translate', { read: TemplateRef }) Translate!: TemplateRef<any>;
    isShrunk = false;
    readonly dialog = inject(MatDialog);
    readonly panelOpenState = signal(false);

    // Import COUNTRY_LANGUAGE_LIST from its module
    countryLanguages = COUNTRY_LANGUAGE_LIST;
    selectedLanguageId: number | null = null;
    selectedLanguageCode: string = '';

    constructor(private router: Router, private translate: TranslateService,
        private messageService: MessageService
    ) {
        super();
    }


    ngOnInit(): void {
    }

    goToApp() {
        this.router.navigate(['/auth/login']);
    }


    @HostListener('window:scroll', [])
    onScroll(): void {
        if (this.isBrowser && this.win) {
            this.isShrunk = this.win.scrollY > 30;
        }
    }
    toggleMobileMenu() {
    }

    openTranslate() {
        this.dialog.open(this.Translate);
    }

    closeTranslate() {
        this.dialog.closeAll();
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
}