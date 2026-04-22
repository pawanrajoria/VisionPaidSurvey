import { Component, OnInit, ViewEncapsulation } from "@angular/core";
import { animate, query, stagger, style, transition, trigger } from "@angular/animations";
import { SharedModule } from "../../../shared.module";
import { BaseComponent } from "../../../base.component";

@Component({
    selector: 'app-root-faq',
    imports: [SharedModule],
    templateUrl: './root-faq.component.html',
    styleUrls: ['./root-faq.component.scss'],
    animations: [
        trigger('fadeIn', [
            transition(':enter', [
                query('mat-card', [
                    style({ opacity: 0, transform: 'translateY(20px)' }),
                    animate('500ms ease-out', style({ opacity: 1, transform: 'none' }))
                ], { optional: true })
            ])
        ]),
        trigger('cardAnimation', [
            transition(':enter', [
                style({ opacity: 0, transform: 'scale(0.9)' }),
                animate('200ms ease-out', style({ opacity: 1, transform: 'scale(1)' })),
            ]),
        ]),
    ]
})
export class FaqRootComponent extends BaseComponent implements OnInit {

    // We keep the structure here so the HTML knows how many panels/lines to render
    faqs = [
        { answer: new Array(3) }, // Q0
        { answer: new Array(4) }, // Q1
        { answer: new Array(3) }, // Q2
        { answer: new Array(2) }, // Q3
        { answer: new Array(2) }, // Q4
        { answer: new Array(3) }, // Q5
        { answer: new Array(2) }, // Q6
        { answer: new Array(3) }, // Q7
        { answer: new Array(5) }, // Q8
        { answer: new Array(2) }, // Q9
        { answer: new Array(2) }, // Q10
        { answer: new Array(2) }, // Q11
        { answer: new Array(2) }, // Q12
        { answer: new Array(2) }, // Q13
        { answer: new Array(2) }, // Q14
        { answer: new Array(2) }  // Q15
    ];

    constructor() { super(); }
    ngOnInit(): void { }
}