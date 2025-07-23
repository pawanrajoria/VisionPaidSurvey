import { Component, ElementRef, inject, Inject, OnInit, PLATFORM_ID, ViewChild } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { OfferService } from "../offer/offer.service";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { IFrameOfferWallDialog } from "./iframe-offerwall/iframe-offerwall.component";

@Component({
    selector: 'app-offer-wall',
    imports: [SharedModule],
    templateUrl: './offer-wall.component.html',
    styleUrls: ['./offer-wall.component.scss']
})
export class OfferWallComponent implements OnInit {
    @ViewChild('carousel', { static: true }) carousel!: ElementRef;
    @ViewChild('carousel1', { static: true }) carousel1!: ElementRef;
    readonly dialog = inject(MatDialog);
    dialogRef: MatDialogRef<any> | null = null;
    offerspartners = [
        { id: 2, name: 'Bit Lab', logo: 'assets/images/partners/BitLabsWhiteLogo.png', rating: 5, bonus: 50, description: 'RevU+' },
        { id: 4, name: 'TimeWall', logo: 'assets/images/partners/timewall-logo.png', rating: 5, bonus: 20 },
        { id: 5, name: 'CPA Lead', logo: 'assets/images/partners/dark_logo_cpalead.webp', rating: 5, bonus: 50 },
        { id: 3, name: 'Notik', logo: 'assets/images/partners/notik_logo.png', rating: 5, bonus: 20 },
    ];

    surveyspartners = [
        { id: 2, name: 'Bit Lab', logo: 'assets/images/partners/BitLabsWhiteLogo.png', rating: 5, bonus: 50, description: 'RevU+' },
        { id: 9, name: 'CPX Research', logo: 'assets/images/partners/logo-cpx-reserach-green.svg', rating: 4, bonus: 50 },
        { id: 10, name: 'SaySo', logo: 'assets/images/partners/sayso.webp', rating: 5, bonus: 50, description: 'RevU+' },
    ];

    constructor(private offerService: OfferService, private breakpointObserver: BreakpointObserver,
        @Inject(PLATFORM_ID) private platformId: any) {
    }

    async ngOnInit() {
    }


    stars(rating: number): string[] {
        return Array(5)
            .fill('star_border')
            .map((s, i) => (i < rating ? 'star' : 'star_border'));
    }

    scroll(direction: 'left' | 'right') {
        const el = this.carousel.nativeElement;
        const scrollAmount = 200;
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }

    scroll1(direction: 'left' | 'right') {
        const el = this.carousel1.nativeElement;
        const scrollAmount = 200;
        el.scrollBy({ left: direction === 'left' ? -scrollAmount : scrollAmount, behavior: 'smooth' });
    }

    async goToPartner(partner: any) {
        const self = this;
        const output = await self.offerService.getOfferWallDetailById(partner.id);
        if (!!output && !!output.iFrameUrl) {
            this.breakpointObserver.observe([Breakpoints.Handset]).subscribe(result => {

                if (this.dialogRef) {
                    this.dialogRef.close();
                }

                const config = new MatDialogConfig();
                if (result.matches) {
                    // Mobile
                    config.width = '100vw';
                    config.height = '100vh';
                    config.maxWidth = '100vw';
                    config.maxHeight = '100vh';
                    config.panelClass = 'full-screen-dialog';
                } else {
                    // Desktop
                    config.width = '40vw';
                    config.height = '90vh';
                    config.maxWidth = '30vw';
                    config.maxHeight = '100vh';
                    config.panelClass = 'slide-in-dialog';
                }

                config.data = {
                    partner: partner,
                    iFrameUrl: output.iFrameUrl
                };

                this.dialogRef = this.dialog.open(IFrameOfferWallDialog, config);
            });


        }
    }
}