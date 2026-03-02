import { Component, DOCUMENT, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { SharedModule } from '../../shared.module';
import { isPlatformBrowser } from '@angular/common';

@Component({
    selector: 'app-survey-redirects',
    imports: [SharedModule],
    templateUrl: './survey-redirects.component.html',
    styleUrls: ['./survey-redirects.component.scss']
})
export class SurveyRedirectsComponent implements OnInit {
    status: number = 0;
    redirectUrl: string = '';
    countdown: number = 3;
    private timer: any;

    constructor(
        private route: ActivatedRoute,
        private renderer: Renderer2,
        @Inject(DOCUMENT) private document: Document,
        @Inject(PLATFORM_ID) private platformId: Object
    ) { }

    ngOnInit(): void {
        // 1. Get Status from Query Params
        this.route.queryParams.subscribe(params => {
            this.status = +params['status'] || 0;
            this.redirectUrl = params['redirectUrl'] || '';
        });

        // 2. Browser-only Logic (SSR Safety)
        if (isPlatformBrowser(this.platformId)) {
            this.initTranslate();
            this.startRedirectTimer();
        }
    }

    initTranslate(): void {
        // Define the global callback function for Google Translate
        (window as any).googleTranslateElementInit = () => {
            new (window as any).google.translate.TranslateElement({
                pageLanguage: 'en',
                layout: (window as any).google.translate.TranslateElement.InlineLayout.SIMPLE,
                autoDisplay: false
            }, 'google_translate_element');
        };

        // Dynamically inject the script
        const script = this.renderer.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
        script.async = true;
        script.defer = true;
        this.renderer.appendChild(this.document.body, script);
    }

    openTranslate(): void {
        if (isPlatformBrowser(this.platformId)) {
            // Find the Google Translate widget trigger (it's injected into a specific class)
            const element = this.document.querySelector('.goog-te-menu-value span') as HTMLElement;
            if (element) {
                element.click();
            } else {
                // console.log('Translate widget still loading...');
            }
        }
    }

    startRedirectTimer(): void {
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

    ngOnDestroy(): void {
        this.stopTimer();
        // Clean up global callback to prevent memory leaks in SSR/Browser
        if (isPlatformBrowser(this.platformId)) {
            delete (window as any).googleTranslateElementInit;
        }
    }

    goToSurvey(): void {
        if (this.redirectUrl && isPlatformBrowser(this.platformId)) {
            window.location.href = this.redirectUrl;
        }
    }
}