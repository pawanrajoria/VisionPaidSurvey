import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";
import { MatIconModule, MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';
import { BaseComponent } from "../../../base.component";

@Component({
    selector: 'app-root-footer',
    imports: [PublicSharedModule,MatIconModule],
    templateUrl: './root-footer.component.html',
    styleUrls: ['./root-footer.component.scss']
})
export class RootFooterComponent extends BaseComponent implements OnInit, AfterViewInit, OnDestroy {
    // The three ProfitPiller Android apps shown in the footer's app section.
    readonly apps = [
        { id: 'surveys', name: 'ProfitPiller', icon: 'assets/images/apps/profitpiller-icon.png', url: 'https://play.google.com/store/apps/details?id=com.cralpkresearch.profitpiller' },
        { id: 'quiz', name: 'ProfitPiller Quiz', icon: 'assets/images/apps/quiz-icon.png', url: 'https://play.google.com/store/apps/details?id=com.profitpiller.quiz' },
        { id: 'puzzle', name: 'ProfitPiller Puzzle', icon: 'assets/images/apps/puzzle-icon.png', url: 'https://play.google.com/store/apps/details?id=com.profitpiller.puzzle' },
    ];

    private observer?: IntersectionObserver;

    constructor(
        private host: ElementRef<HTMLElement>,
        private matIconRegistry: MatIconRegistry,
        private sanitizer: DomSanitizer
    ) {
        super();
        this.matIconRegistry.addSvgIcon(
            'facebook',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/facebook.svg')
        );

        this.matIconRegistry.addSvgIcon(
            'twitterx',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/twitter-x.svg')
        );

        this.matIconRegistry.addSvgIcon(
            'linkedin',
            this.sanitizer.bypassSecurityTrustResourceUrl('assets/icons/linkedin.svg')
        );
    }

    ngOnInit(): void {
    }

    // Blocks marked [data-reveal] fade up as the footer scrolls into view. Only in the browser,
    // and only once the observer exists, so server-rendered and no-JS pages show everything.
    ngAfterViewInit(): void {
        if (!this.isBrowser || !this.win || !('IntersectionObserver' in this.win)) return;

        const root = this.host.nativeElement;
        root.classList.add('pf-animate');
        this.observer = new IntersectionObserver(entries => {
            for (const entry of entries) {
                if (!entry.isIntersecting) continue;
                entry.target.classList.add('is-in');
                this.observer?.unobserve(entry.target);
            }
        }, { threshold: 0.15 });
        root.querySelectorAll('[data-reveal]').forEach(el => this.observer!.observe(el));
    }

    ngOnDestroy(): void {
        this.observer?.disconnect();
    }

}
