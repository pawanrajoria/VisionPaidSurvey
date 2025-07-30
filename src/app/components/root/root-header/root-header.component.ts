import { Component, OnInit, HostListener, inject, ViewChild, TemplateRef, signal } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { Router } from "@angular/router";
import { BaseComponent } from "../../../base.component";
import { MatDialog } from "@angular/material/dialog";

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
        this.dialog.open(this.Translate);
    }

    closeTranslate() {
        this.dialog.closeAll();
    }
}