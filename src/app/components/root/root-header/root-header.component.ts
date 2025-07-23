import { Component, OnInit, HostListener, Input } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { Router } from "@angular/router";

@Component({
    selector: 'app-root-header',
    imports: [SharedModule],
    templateUrl: './root-header.component.html',
    styleUrls: ['./root-header.component.scss']
})
export class RootHeaderComponent implements OnInit {
    isShrunk = false;


    constructor(private router: Router) {
    }


    ngOnInit(): void {
    }

    goToApp() {
        this.router.navigate(['/auth/login']);
    }


    @HostListener('window:scroll', [])
    onScroll(): void {
        this.isShrunk = window.scrollY > 30;
    }

    toggleMobileMenu() {
    }
    
}