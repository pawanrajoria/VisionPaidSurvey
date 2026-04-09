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

    faqs = [
        {
            question: 'How can I make money with paid surveys?',
            answer: [
                'ProfitPiller is a free website where you can earn real money for taking paid surveys.',
                'Simply sign up with your email and start earning today. Most users withdraw their first cash on the same day!',
                'You can take surveys anytime from your phone or computer.'
            ],
        },
        {
            question: 'How does taking surveys work?',
            answer: [
                'First, sign up for ProfitPiller — it’s free and only requires your email address.',
                'Once logged in, you’ll see a list of available surveys with details on duration and payout.',
                'Click on a survey, complete a few qualification questions, and then finish the main survey.',
                'After completion, you’ll be rewarded with points, which can be redeemed instantly.'
            ],
        },
        {
            question: 'Do I need to give you my personal data?',
            answer: [
                'No! We will never sell or share your email with survey clients.',
                'Surveys will not ask for personal identifying information like your name or address.',
                'All your responses remain anonymous.'
            ],
        },
        {
            question: 'How much money can I make?',
            answer: [
                'ProfitPiller is not a full-time job, but with just 30–60 minutes per day, you can earn enough for everyday luxuries.',
                'Check our live stats to see what other users earned yesterday!'
            ],
        },
        {
            question: 'Does ProfitPiller pay better than other websites?',
            answer: [
                'Yes! On average, ProfitPiller pays up to 150% more for the same surveys.',
                'We focus on rewarding our users instead of spending on heavy marketing.'
            ],
        },
        {
            question: 'Can I really withdraw cash?',
            answer: [
                'Yes! You can withdraw cash instantly to your PayPal or bank account.',
                'Withdrawals are processed immediately and typically credited within hours.',
                'You can also redeem various gift cards for popular services like Amazon, Shopify, Apple, and more.'
            ],
        },
        {
            question: 'Is there a minimum withdrawal amount?',
            answer: [
                'Not really! It’s flexible.',
                'When signing up, you choose your Welcome Bonus — either a quick cashout with a small amount or a larger bonus with a slightly higher minimum withdrawal.'
            ],
        },
        {
            question: 'What is important when taking surveys?',
            answer: [
                'Your opinions directly impact products and services of major brands.',
                'That’s why it’s important to stay honest and focused while answering.',
                'Surveys monitor the quality of responses — insincere answers may lead to disqualification.'
            ],
        },
        {
            question: 'These are some tips for successfully completing surveys',
            answer: [
                "Don't rush. Take your time to read the questions.",
                'Be honest. Give accurate answers about yourself and your opinion.',
                "Don't use a VPN or public Wi-Fi. Services that hide your connection are flagged as fraud.",
                'Be open. Avoid answering “I don’t want to answer” too often — it could disqualify you.',
                'Be detailed. Provide thoughtful answers in open-ended questions. Low-effort or offensive content may get you screened out.'
            ],
        },
        {
            question: 'How can I make money with surveys and offers?',
            answer: [
                'ProfitPiller allows you to earn real rewards by completing online surveys and exploring special offers.',
                'Choose what interests you, complete it, and earn points you can redeem for cash or gift cards.'
            ],
        },
        {
            question: 'What kind of offers can I complete?',
            answer: [
                'Offers may include signing up for free trials, downloading apps, or engaging with new services.',
                'They’re quick, easy, and add to your earnings alongside surveys.'
            ],
        },
        {
            question: 'Do surveys and offers pay the same?',
            answer: [
                'Reward amounts vary depending on the length and requirements.',
                'Some offers may pay more, especially if they involve sign-ups or installs.'
            ],
        },
        {
            question: 'How fast can I earn with surveys and offers?',
            answer: [
                'Many users earn enough for their first reward within the same day.',
                'Offers often credit faster, while surveys provide steady daily earnings.'
            ],
        },
        {
            question: 'Can I choose which surveys or offers to complete?',
            answer: [
                'Yes! ProfitPiller lets you choose from a wide range of surveys and offers.',
                'You are always in control of what you complete.'
            ],
        },
        {
            question: 'Do I need to complete both to earn rewards?',
            answer: [
                'No. You can earn from surveys or offers independently.',
                'Combining both just helps you reach rewards faster.'
            ],
        },
        {
            question: 'Is it free to complete offers?',
            answer: [
                'Many offers are completely free — like app installs or newsletter sign-ups.',
                'Some may involve a purchase or free trial, so always read the offer details.'
            ],
        },
    ];

    constructor() {
        super();
    }

    ngOnInit(): void {
    }

}