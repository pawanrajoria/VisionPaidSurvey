import { Component, ElementRef, inject, OnInit, TemplateRef, ViewChild } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import { OfferService } from "../offer/offer.service";
import { SurveyService } from "../survey/survey.service";
import { IOfferResponseDto } from "../offer/offer.vm";
import { EmptySkeltenComponent } from "./empty-skelten/empty-skelten.component";
import { BreakpointObserver, Breakpoints } from "@angular/cdk/layout";
import { MatDialog, MatDialogConfig, MatDialogRef } from "@angular/material/dialog";
import { IFrameOfferWallDialog } from "../offer-wall/iframe-offerwall/iframe-offerwall.component";
import { BaseComponent } from "../../../base.component";
import { ISurveyVM } from "../survey/survey.vm";
import { SurveyFeedBackPopupComponent } from "../survey/survey-common-popup/survey-feedback-popup/survey-feedback-popup";
import { OfferPopupDialog } from "../offer/offer-popup/offer-popup.component";
import { FraudService } from "../../../frauddetection.service";
import { BaseSurveyComponent } from "../../../base.survey.component";
import { SurveyInstructionPopupComponent } from "../survey/survey-common-popup/survey-instruction-popup/survey-instruction-popup";
import { Router } from "@angular/router";
import { EngagementService } from "../engagement/engagement.service";
import { IEngagementSummary, IPriorityOffer } from "../engagement/engagement.vm";


@Component({
    selector: 'app-earn',
    imports: [SharedModule, EmptySkeltenComponent],
    templateUrl: './earn.component.html',
    styleUrls: ['./earn.component.scss', './earn-engagement.scss']
})
export class EarnComponent extends BaseSurveyComponent implements OnInit {
    @ViewChild('gamingSlider', { read: ElementRef }) gamingSlider!: ElementRef;
    @ViewChild('offerSlider', { read: ElementRef }) offerSlider!: ElementRef;
    @ViewChild('surveySlider', { read: ElementRef }) surveySlider!: ElementRef;
    @ViewChild('offerwallSlider', { read: ElementRef }) offerwallSlider!: ElementRef;
    @ViewChild('surveyWallSlider', { read: ElementRef }) surveyWallSlider!: ElementRef;

    gamingOffers: IOfferResponseDto[] = [];
    otherOffers: IOfferResponseDto[] = [];

    isGamingOfferLoading: boolean = true;
    isOtherOfferLoading: boolean = true;
    isFeaturedSurveyLoading: boolean = true;
    isOfferLoading: boolean = true;


    surveys: any[] = [];
    offerPartners: any[] = [];
    surveyPartners: any[] = [];
    featuredSurveys: any[] = [];


    selectedDeviceType: string[] = [];
    offers: IOfferResponseDto[] = [];
    filteredOffers: IOfferResponseDto[] = [];

    searchTxt = '';

    isLoading: boolean = false;

    readonly offerService = inject(OfferService);
    readonly surveyService = inject(SurveyService);

    dialogRef: MatDialogRef<any> | null = null;

    @ViewChild('partnerSlider', { read: ElementRef }) partnerSlider!: ElementRef;
    @ViewChild('prioritySlider', { read: ElementRef }) prioritySlider!: ElementRef;

    readonly engagement = inject(EngagementService);
    readonly router = inject(Router);

    priorityOffers: IPriorityOffer[] = [];
    summary: IEngagementSummary | null = null;

    constructor(private breakpointObserver: BreakpointObserver) {
        super();
    }

    async ngOnInit() {

        this.fraudService.resetTracking();
        this.fraudService.startTracking();

        // Everything loads in parallel and in the background: our own (fast) data paints
        // first, the third-party offer/survey lists fill their skeletons when they arrive.
        this.loadEngagement();
        this.loadPriorityOffers();
        this.getOffers();
        this.getSurveys();
    }

    async getOffers() {
        try {
            this.offers = (await this.offerService.getOffers(true)) ?? [];
            this.preselectPlatform();
        } catch {
            this.offers = [];
        } finally {
            this.isGamingOfferLoading = false;
            this.isOtherOfferLoading = false;
            this.isOfferLoading = false;
        }
        this.filterItems();
    }


    async getSurveys() {
        const self = this;
        let output: any = null;
        try {
            output = await self.surveyService.getSurveys(true);
            this.surveyNotice = output?.restrictionMessage ?? '';
        } catch {
            output = null;
        }
        self.isFeaturedSurveyLoading = false;
        if (!!output && !!output.surveys && output.surveys.length > 0) {
            this.featuredSurveys = output.surveys.sort((a: any, b: any) => {
                return (b.isProfileSurvey === true ? 1 : 0) - (a.isProfileSurvey === true ? 1 : 0);
            });
        }
    }

    /** Server explanation when surveys are hidden (daily limit for new accounts, proxy detected). */
    surveyNotice = '';
    noticeOpen = false;

    @ViewChild('promoTpl') promoTpl?: TemplateRef<unknown>;

    // ───────────── Offer of the day popup ─────────────
    promo: IPriorityOffer | null = null;
    private promoRef: MatDialogRef<unknown> | null = null;

    /** One popup per offer per day; closing it (or opening the offer) silences it until tomorrow. */
    private promoKey(offer: IPriorityOffer): string {
        return `promoSeen:${offer.id}:${new Date().toISOString().slice(0, 10)}`;
    }

    private maybeShowPromo() {
        if (!this.isBrowser || this.promoRef || !this.promoTpl) return;
        const offer = this.priorityOffers.find(o => o.showAsPopup);
        if (!offer) return;
        try {
            if (localStorage.getItem(this.promoKey(offer))) return;
        } catch { /* storage blocked: show it */ }

        this.promo = offer;
        this.promoRef = this.dialog.open(this.promoTpl, {
            width: '400px', maxWidth: '92vw', autoFocus: false, panelClass: ['engage-sheet-panel', 'promo-panel']
        });
        this.promoRef.afterClosed().subscribe(() => {
            try { localStorage.setItem(this.promoKey(offer), '1'); } catch { /* storage blocked */ }
            this.promoRef = null;
        });
    }

    closePromo() {
        this.promoRef?.close();
    }

    acceptPromo() {
        const offer = this.promo;
        this.closePromo();
        if (offer) this.openPriorityOffer(offer);
    }

    // ───────────── Priority offers ─────────────
    async loadPriorityOffers() {
        const offers = await this.engagement.getPriorityOffers();
        const device = this.currentPlatform;
        this.priorityOffers = offers.filter(o => !o.device || o.device === 'All' || o.device === device);
        // Give the page a moment to paint before the popup appears.
        setTimeout(() => this.maybeShowPromo(), 1200);
    }

    /** Matches the Device values an admin can pick: Desktop | Android | IOS. */
    get currentPlatform(): string {
        const ua = this.nav?.userAgent ?? '';
        if (/iPhone|iPad|iPod/i.test(ua)) return 'IOS';
        // iPadOS reports a Mac user agent; the touch screen gives it away.
        if (/Macintosh/i.test(ua) && (this.nav?.maxTouchPoints ?? 0) > 1) return 'IOS';
        if (/Android/i.test(ua)) return 'Android';
        return 'Desktop';
    }

    private platformPreselected = false;

    /**
     * Starts the Android / iOS / Desktop filter on the visitor's own device, so a phone does not
     * open on desktop-only offers. Skipped when nothing would match; the chips stay changeable.
     */
    private preselectPlatform() {
        if (this.platformPreselected || !this.isBrowser) return;
        this.platformPreselected = true;
        const platform = this.currentPlatform;
        if (this.offers.some(o => (o.device ?? []).includes(platform))) {
            this.selectedDeviceType = [platform];
        }
    }

    openPriorityOffer(offer: IPriorityOffer) {
        // Open first, track second: a window opened after an await is treated as a popup and blocked.
        if (offer.isInternal) {
            this.router.navigateByUrl(`/${this.currentLocale}${offer.clickUrl}`);
        } else {
            this.win?.open(offer.clickUrl, '_blank', 'noopener');
        }
        this.engagement.trackPriorityClick(offer.id);
    }

    hidePriorityImage(offer: IPriorityOffer) {
        offer.imageUrl = null;
    }

    // ───────────── Onboarding banner (streak, check-in and checklist live in the header) ─────────────
    async loadEngagement(refresh = false) {
        this.summary = await this.engagement.getSummary(refresh);
    }

    get showProfileBanner(): boolean {
        const o = this.summary?.onboarding;
        return !!o && o.available && !o.completed;
    }

    filterItems() {
        const text = this.searchTxt.toLowerCase();

        this.filteredOffers = this.offers
            .filter(item => {
                // An offer without device information is not restricted to a platform.
                const devices = item.device ?? [];
                const matchesCategory =
                    this.selectedDeviceType.length === 0 || devices.length === 0 ||
                    devices.some(cat => this.selectedDeviceType.includes(cat));

                const matchesText = item.offerName?.toLowerCase().includes(text);
                return matchesCategory && matchesText;
            });
        this.gamingOffers = this.filteredOffers;
        this.otherOffers = this.filteredOffers.filter(offer => offer?.payoutType?.toLowerCase() == 'cpi' || offer?.payoutType?.toLowerCase() == 'survey');
    }

    scrollLeft(sliderId: string) {
        const slider = this.getSlider(sliderId);
        slider.scrollLeft -= 300;
    }

    scrollRight(sliderId: string) {
        const slider = this.getSlider(sliderId);
        slider.scrollLeft += 300;
    }

    private getSlider(id: string): HTMLElement {
        if (id === 'gamingSlider') {
            return this.gamingSlider.nativeElement;
        }
        else if (id === 'offerSlider') {
            return this.offerSlider.nativeElement;
        }
        else if (id === 'surveySlider') {
            return this.surveySlider.nativeElement;
        }
        else if (id === 'offerwallSlider') {
            return this.offerwallSlider.nativeElement;
        }
        else if (id === 'surveyWallSlider') {
            return this.surveyWallSlider.nativeElement;
        }
        else if (id === 'partnerSlider') {
            return this.partnerSlider.nativeElement;
        }
        else if (id === 'prioritySlider') {
            return this.prioritySlider.nativeElement;
        }
        throw new Error('Invalid slider ID');
    }

    stars(rating: number): string[] {
        return Array(5)
            .fill('star_border')
            .map((s, i) => (i < rating ? 'star' : 'star_border'));
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

    async attemptSurvey(item: ISurveyVM) {
        if (item.isProfileSurvey) {
            this.openSurveyInstruction(item);
        }
        else {
            this.startSurvey(item);
            this.getSurveys();
        }
    }

    async openSurveyInstruction(item: ISurveyVM) {
        const dialofref = this.dialog.open(SurveyInstructionPopupComponent, {
            width: '480px',          // Reduced from 600px
            maxWidth: '92vw',
            maxHeight: '85vh',       // Enforces total height limit
            autoFocus: false,
            panelClass: 'survey-instruction-dialog'
        });
        dialofref.afterClosed().subscribe(async (result) => {
            if (result === "startSurvey") {
                await this.startSurvey(item);
                dialofref.close();
                this.getSurveys();
            } else if (result === "close") {
                dialofref.close();
            }
        });
    }

    openOfferDialog(item: IOfferResponseDto) {
        let dialogWidth = '600px';

        if (this.isBrowser && this.breakpointObserver.isMatched('(max-width: 600px)')) {
            dialogWidth = '100vw';
        }

        item.currentDevice = this.currentDevice;

        this.dialog.open(OfferPopupDialog, {
            width: dialogWidth,
            maxWidth: '100vw',
            panelClass: 'custom-dialog-container',
            data: item
        });
    }

    get currentDevice(): string {
        if (!this.isBrowser || !this.nav) return 'Unknown';

        const ua = this.nav.userAgent;
        if (/iPhone|iPad|iPod|Android/i.test(ua)) return 'Mobile';
        if (/Tablet|iPad/i.test(ua)) return 'Tablet';
        return 'Desktop';
    }

    hasProfileSurvey(): boolean {
        return this.featuredSurveys.some(survey => survey.isProfileSurvey === true);
    }

    scroll(el: HTMLElement, distance: number) {
        el.scrollBy({
            left: distance,
            behavior: 'smooth'
        });
    }



}