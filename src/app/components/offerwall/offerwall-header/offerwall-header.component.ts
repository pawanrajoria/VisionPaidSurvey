import { Component, OnInit, HostListener, inject } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { Router } from "@angular/router";
import { BaseComponent } from "../../../base.component";
import { MatDialog } from "@angular/material/dialog";
import { TranslateComponent } from "../../layout/translator/translator.component";

@Component({
    selector: 'app-offerwall-header',
    imports: [SharedModule],
    templateUrl: './offerwall-header.component.html',
    styleUrls: ['./offerwall-header.component.scss']
})
export class OfferwallHeaderComponent extends BaseComponent implements OnInit {
    isShrunk = false;
    readonly dialog = inject(MatDialog);


    constructor(private router: Router) {
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
        this.dialog.open(TranslateComponent);
    }

}