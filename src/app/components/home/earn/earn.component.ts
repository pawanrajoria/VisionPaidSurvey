import { Component, ElementRef, inject, OnInit, ViewChild } from "@angular/core";
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


@Component({
    selector: 'app-earn',
    imports: [SharedModule, EmptySkeltenComponent],
    templateUrl: './earn.component.html',
    styleUrls: ['./earn.component.scss']
})
export class EarnComponent extends BaseComponent implements OnInit {
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

    readonly dialog = inject(MatDialog);
    dialogRef: MatDialogRef<any> | null = null;

    constructor(private breakpointObserver: BreakpointObserver, private fraudService: FraudService) {
        super();
    }

    async ngOnInit() {

        this.fraudService.resetTracking();
        this.fraudService.startTracking();

        this.getOffers();
        this.getSurveys();
    }

    async getOffers() {
        this.offers = await this.offerService.getOffers();
        this.isGamingOfferLoading = false;
        this.isOtherOfferLoading = false;
        this.isOfferLoading = false;
        this.filterItems();
    }


    async getSurveys() {
        const self = this;
        const output = await self.surveyService.getSurveys();
        self.isFeaturedSurveyLoading = false;
        if (!!output && !!output.surveys && output.surveys.length > 0) {
            this.featuredSurveys = output.surveys.sort((a: any, b: any) => {
                return (b.isProfileSurvey === true ? 1 : 0) - (a.isProfileSurvey === true ? 1 : 0);
            });
        }
    }

    filterItems() {
        const text = this.searchTxt.toLowerCase();

        this.filteredOffers = this.offers
            .filter(item => {
                const matchesCategory =
                    this.selectedDeviceType.length === 0 ||
                    item.device.some((cat: any) => this.selectedDeviceType.includes(cat));

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

    async startSurvey(item: ISurveyVM) {
        let winNew: Window | null = null;

        if (this.win) {
            // Open immediately (user gesture safe)
            winNew = this.win.open('', '_blank');

            if (!winNew) {
                alert('Popup blocked. Please allow popups for this site.');
                return;
            }
        }

        const fraudSignals: any = await this.fraudService.collectSignals();

        if (fraudSignals && fraudSignals.decision === "BLOCK") {
            await this.logUserActivity("Survey", "StartSurvey", "SurveyScore", fraudSignals.decision);
            winNew?.close(); // close opened tab if blocked
            return;
        }

        // Now redirect the already opened tab
        if (winNew) {
            winNew.location.href = item.clickUrl;
        }

        await this.logUserActivity("Survey", "StartSurvey", "Click", item.clickUrl);
        await this.feedbackSurvey(item);
    }

    async feedbackSurvey(item: ISurveyVM) {
        const dialofref = this.dialog.open(SurveyFeedBackPopupComponent);
        dialofref.afterClosed().subscribe(async (result) => {
            if (result === "submitForm") {
                // call rating api
                dialofref.close();
            } else if (result === "close") {
                this.getSurveys();
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