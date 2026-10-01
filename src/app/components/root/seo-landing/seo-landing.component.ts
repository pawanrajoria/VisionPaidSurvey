import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SeoLandingService } from './seo-landing.service';
import { PublicSharedModule } from '../../../public-shared.module';

@Component({
    selector: 'app-seo-landing',
    standalone: true,
    imports: [PublicSharedModule],
    templateUrl: './seo-landing.component.html'
})
export class SeoLandingComponent implements OnInit {
    data: any;

    constructor(
        private route: ActivatedRoute,
        private seo: SeoLandingService,
        private http: HttpClient
    ) { }

    async ngOnInit() {
        const params = this.route.snapshot.params;

        let res: any = null;
        try {
            res = await this.seo.getSeoPage(params);
        } catch {
            return; // API unavailable: leave the page shell instead of throwing during render
        }
        if (!!res) {
            // The template renders from `data`; it was never assigned, so these pages were blank.
            this.data = { ...res, country: params['country'] };
            this.seo.update({
                title: res.metaTitle,
                description: res.metaDescription,
                keywords: res.keywords
                // canonical intentionally not passed: the API returns a locale-less URL on another
                // host; the app-level canonical (current locale + path) is the correct one.
            });
        }
    }
}