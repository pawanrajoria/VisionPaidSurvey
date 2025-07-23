import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../../../shared.module";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "../../../../layout/base.component";

@Component({
    selector: 'redirect-offer',
    imports: [SharedModule],
    template: '<p>Redirecting...</p>'
})
export class OfferLinkComponent extends BaseComponent implements OnInit {

    constructor(private route: ActivatedRoute, private router: Router) {
        super();
    }


    async ngOnInit() {
        const target = this.route.snapshot.queryParamMap.get('target');

        if (target) {
            await this.logUserActivity("Offer", "offerLink", "Click", target);
            window.location.href = target;
        } else {
            // fallback
            this.router.navigate(['/app']);
        }
    }
}