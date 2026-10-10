import { Component, OnInit, HostListener, inject } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";
import { Router } from "@angular/router";
import { BaseComponent } from "../../../base.component";
import { MatDialog } from "@angular/material/dialog";
import { TranslateComponent } from "../../layout/translator/translator.component";
import { HttpClient } from "@angular/common/http";
import { ConfigService } from "../../../config.service";

interface IRecentPayout { method: string; amountUsd: number; }

/** Shown when there were no cash-outs recently: the real payout methods, without amounts. */
const PAYOUT_METHODS: IRecentPayout[] = [
    { method: 'PayPal', amountUsd: 0 }, { method: 'UPI', amountUsd: 0 },
    { method: 'Gift card', amountUsd: 0 }, { method: 'Amazon', amountUsd: 0 }, { method: 'Visa', amountUsd: 0 }
];

@Component({
    selector: 'app-root-header',
    imports: [PublicSharedModule],
    templateUrl: './root-header.component.html',
    styleUrls: ['./root-header.component.scss']
})
export class RootHeaderComponent extends BaseComponent implements OnInit {
    isShrunk = false;
    readonly dialog = inject(MatDialog);
    private readonly http = inject(HttpClient);
    private readonly config = inject(ConfigService);

    /** Real recent cash-outs; the strip used to show a hardcoded list (some below the $5 minimum). */
    payouts: IRecentPayout[] = PAYOUT_METHODS;


    constructor(private router: Router) {
        super();
    }


    ngOnInit(): void {
        this.http.get<IRecentPayout[]>(this.config.baseUrl + 'app/recent-payouts').subscribe({
            next: items => {
                const real = (Array.isArray(items) ? items : []).filter(i => i?.amountUsd > 0);
                // A short list is repeated so the scrolling strip stays full.
                if (real.length) this.payouts = real.length >= 6 ? real : [...real, ...real, ...real].slice(0, 9);
            },
            error: () => { /* keep the payout methods */ }
        });
    }

    iconFor(method: string): string {
        switch (method) {
            case 'PayPal': return 'assets/images/icon/paypal.png';
            case 'UPI': return 'assets/images/logos/upi.png';
            case 'Visa': return 'assets/images/visa.png';
            default: return 'assets/images/icon/amazon.png';
        }
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
        this.dialog.open(TranslateComponent);
    }

}