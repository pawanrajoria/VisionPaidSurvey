import { Component, DOCUMENT, Inject, OnInit, PLATFORM_ID, Renderer2, OnDestroy, inject, DestroyRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isPlatformBrowser } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SharedModule } from '../../shared.module';

@Component({
    selector: 'app-survey-redirects',
    standalone: true,
    imports: [SharedModule],
    templateUrl: './survey-redirects.component.html',
    styleUrls: ['./survey-redirects.component.scss']
})
export class SurveyRedirectsComponent implements OnInit, OnDestroy {
    status: number = 0;
    redirectUrl: string = '';
    countdown: number = 3;
    private timer: ReturnType<typeof setInterval> | undefined;

    // Injecting DestroyRef for modern cleanup
    private destroyRef = inject(DestroyRef);

    constructor(
        private route: ActivatedRoute,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        // 1. Handle Query Params with auto-cleanup
        this.route.queryParams
            .pipe(takeUntilDestroyed(this.destroyRef))
            .subscribe(params => {
                this.status = +params['status'] || 0;
                this.redirectUrl = params['redirectUrl'] || '';
            });

        // 2. Browser-only Execution
        if (isPlatformBrowser(this.platformId)) {
            this.initTranslate();
            this.startRedirectTimer();
        }
    }

    private initTranslate(): void {
        const windowRef = this.document.defaultView as any;
        if (!windowRef) return;

        // Define global callback safely
        windowRef.googleTranslateElementInit = () => {
            if (windowRef.google?.translate) {
                new windowRef.google.translate.TranslateElement({
                    pageLanguage: 'en',
                    layout: windowRef.google.translate.TranslateElement.InlineLayout.SIMPLE,
                    autoDisplay: false
                }, 'google_translate_element');
            }
        };

        // Inject script using Renderer2 (Best Practice)
        const script = this.renderer.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        script.defer = true;
        this.renderer.appendChild(this.document.body, script);
    }

    openTranslate(): void {
        if (isPlatformBrowser(this.platformId)) {
            const element = this.document.querySelector('.goog-te-menu-value span') as HTMLElement;
            element?.click();
        }
    }

    private startRedirectTimer(): void {
        // Double check browser platform to prevent SSR hanging
        if (!isPlatformBrowser(this.platformId)) return;

        this.timer = setInterval(() => {
            if (this.countdown > 0) {
                this.countdown--;
            } else {
                this.stopTimer();
                this.goToSurvey();
            }
        }, 1000);
    }

    private stopTimer(): void {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    goToSurvey(): void {
        if (isPlatformBrowser(this.platformId) && this.redirectUrl) {
            this.document.location.href = this.redirectUrl;
        }
    }

    ngOnDestroy(): void {
        this.stopTimer();

        if (isPlatformBrowser(this.platformId)) {
            const windowRef = this.document.defaultView as any;
            if (windowRef) {
                delete windowRef.googleTranslateElementInit;
            }
        }
    }
}