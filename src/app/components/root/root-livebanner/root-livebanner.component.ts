import { Component, OnInit } from "@angular/core";
import { PublicSharedModule } from "../../../public-shared.module";

@Component({
    selector: 'app-root-livebanner',
    imports: [PublicSharedModule],
    templateUrl: './root-livebanner.component.html',
    styleUrls: ['./root-livebanner.component.scss']
})
export class RootLiveBannerComponent implements OnInit {
    payouts = [
        { icon: 'assets/images/paypal.png', label: 'PayPal', amount: '€5' },
        { icon: 'assets/images/paypal.png', label: 'PayPal International', amount: '£5' },
        { icon: 'assets/images/visa.png', label: 'Visa', amount: '€10' },
        { icon: 'assets/images/xbox.png', label: 'Xbox', amount: '$10' },
        { icon: 'assets/images/uber.png', label: 'Uber', amount: '£50' },
        { icon: 'assets/images/playstation.png', label: 'Playstation', amount: '$20' },
        { icon: 'assets/images/visa.png', label: 'Visa', amount: '$20' },
        { icon: 'assets/images/paypal.png', label: 'PayPal International', amount: '$9' },
        { icon: 'assets/images/paypal.png', label: 'PayPal International', amount: '$5' },
        { icon: 'assets/images/paypal.png', label: 'PayPal International', amount: '$3' },
        { icon: 'assets/images/paypal.png', label: 'PayPal International', amount: '$2' },
        { icon: 'assets/images/paypal.png', label: 'PayPal International', amount: '$8' },
    ];

    ngOnInit(): void {
        
    }

}