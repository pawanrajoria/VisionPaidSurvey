import { afterNextRender, ChangeDetectorRef, Component, ElementRef, OnInit, signal, ViewChild } from "@angular/core";
import { SharedModule } from "../../../shared.module";
import {
    NguTileComponent,
    NguCarouselPrevDirective,
    NguCarouselDefDirective,
    NguCarouselNextDirective,
    NguCarouselPointDirective,
    NguCarousel,
    NguCarouselConfig
} from '@ngu/carousel';

@Component({
    selector: 'app-reward',
    imports: [SharedModule,
        NguCarousel,
        NguCarouselPrevDirective,
        NguCarouselDefDirective,
        NguTileComponent,
        NguCarouselNextDirective,
        NguCarouselPointDirective
    ],
    templateUrl: './ngu-carousel.html',
    styleUrls: ['./ngu-carousel.scss'],
})
export class NguCarousalComponent {

    public carouselTileConfig: NguCarouselConfig = {
        grid: { xs: 1, sm: 1, md: 1, lg: 10, all: 0 },  // Ensure grid is properly set
        speed: 250,
        point: {
            visible: true
        },
        touch: false,
        loop: false,
        slide: 1,
        load: 2,
        // interval: { timing: 1500 },
        animation: 'lazy',
    };

    constructor() {
    }

    carouselItemsArray = [{}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}, {}];

    trackByIndex(index: number): number {
        return index;
    }

}