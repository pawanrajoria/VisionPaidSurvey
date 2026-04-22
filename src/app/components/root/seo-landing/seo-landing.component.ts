import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { SeoLandingService } from './seo-landing.service';
import { SharedModule } from '../../../shared.module';

@Component({
    selector: 'app-seo-landing',
    standalone: true,
    imports: [SharedModule],
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

        const res = await this.seo.getSeoPage(params);
        if (!!res) {
            this.seo.update({
                title: res.metaTitle,
                description: res.metaDescription,
                keywords: res.keywords,
                canonical: res.canonical
            });
        }
    }
}