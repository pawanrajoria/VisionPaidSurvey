import { Component, OnInit, HostListener, Input } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { Router } from "@angular/router";
import { BaseComponent } from "../../../base.component";

@Component({
    selector: 'app-root-header',
    imports: [SharedModule],
    templateUrl: './root-header.component.html',
    styleUrls: ['./root-header.component.scss']
})
export class RootHeaderComponent extends BaseComponent implements OnInit {
    isShrunk = false;


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

}