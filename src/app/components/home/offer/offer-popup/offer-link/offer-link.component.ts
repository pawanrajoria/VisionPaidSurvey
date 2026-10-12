import { Component, OnInit } from "@angular/core";
import { SharedModule } from "../../../../../shared.module";
import { ActivatedRoute, Router } from "@angular/router";
import { BaseComponent } from "../../../../../base.component";

@Component({
    selector: 'redirect-offer',
    imports: [SharedModule],
    template: `<p>{{ 'app.common.redirecting' | translate }}</p>`
})
export class OfferLinkComponent extends BaseComponent implements OnInit {

    constructor(private route: ActivatedRoute, private router: Router) {
        super();
    }


    async ngOnInit() {
        const target = this.route.snapshot.queryParamMap.get('target');
        if (target) {
            const decoded = decodeURIComponent(target);
            // The redirect must not depend on the activity log: the app opens this page in the phone's browser,
            // where a slow or failed log call left members on "Redirecting…" instead of the offer.
            const logged = this.logUserActivity("Offer", "offerLink", "Click", decoded).catch(() => { });
            await Promise.race([logged, new Promise(resolve => setTimeout(resolve, 800))]);
            if (this.win) this.win.location.href = decoded;
        } else {
            // fallback
            this.router.navigate(['/app']);
        }
    }
}