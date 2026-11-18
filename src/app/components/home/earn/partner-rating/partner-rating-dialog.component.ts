import { Component, inject } from "@angular/core";
import { MAT_DIALOG_DATA, MatDialogRef } from "@angular/material/dialog";
import { SharedModule } from "../../../../shared.module";
import { PartnerRatingService } from "./partner-rating.service";

/** "How was {partner}?" - asked once a member closes a partner's wall. */
@Component({
    selector: 'app-partner-rating-dialog',
    imports: [SharedModule],
    template: `
        <div class="pr">
            <button type="button" class="pr-close" mat-icon-button (click)="close()" [attr.aria-label]="'app.common.close' | translate">
                <mat-icon>close</mat-icon>
            </button>
            @if (!done) {
            <h2>{{ 'app.partnerRating.title' | translate:{ partner: data.name } }}</h2>
            <p>{{ 'app.partnerRating.subtitle' | translate }}</p>
            <div class="pr-stars" role="radiogroup" [attr.aria-label]="'app.partnerRating.title' | translate:{ partner: data.name }">
                @for (star of [1, 2, 3, 4, 5]; track star) {
                <button type="button" role="radio" [attr.aria-checked]="star === picked" [attr.aria-label]="star + ' / 5'"
                    (mouseenter)="hover = star" (mouseleave)="hover = 0" (click)="rate(star)" [disabled]="saving">
                    <mat-icon [class.on]="star <= (hover || picked)">{{ star <= (hover || picked) ? 'star' : 'star_border' }}</mat-icon>
                </button>
                }
            </div>
            <button type="button" class="pr-later" (click)="close()">{{ 'app.partnerRating.notNow' | translate }}</button>
            } @else {
            <mat-icon class="pr-thanks-icon">favorite</mat-icon>
            <h2>{{ 'app.partnerRating.thanks' | translate }}</h2>
            }
        </div>
    `,
    styles: [`
        .pr { position: relative; padding: 24px 20px 18px; text-align: center; }
        .pr-close { position: absolute; top: 4px; right: 4px; }
        h2 { margin: 4px 24px 6px; font-size: 1.15rem; font-weight: 700; color: #105749; }
        p { margin: 0 0 14px; font-size: .9rem; color: #5d6d68; }
        .pr-stars { display: flex; justify-content: center; gap: 4px; margin-bottom: 10px; }
        .pr-stars button { border: 0; background: none; padding: 4px; cursor: pointer; border-radius: 50%; }
        .pr-stars button:focus-visible { outline: 2px solid #105749; }
        .pr-stars mat-icon { width: 38px; height: 38px; font-size: 38px; color: #c9d4d1; transition: transform .15s ease, color .15s ease; }
        .pr-stars mat-icon.on { color: #f5a623; transform: scale(1.08); }
        .pr-later { border: 0; background: none; color: #5d6d68; font-size: .85rem; text-decoration: underline; cursor: pointer; }
        .pr-thanks-icon { width: 40px; height: 40px; font-size: 40px; color: #e11d48; }
    `]
})
export class PartnerRatingDialogComponent {
    readonly data = inject<{ id: number; name: string }>(MAT_DIALOG_DATA);
    private readonly dialogRef = inject(MatDialogRef<PartnerRatingDialogComponent>);
    private readonly ratings = inject(PartnerRatingService);

    hover = 0;
    picked = 0;
    saving = false;
    done = false;

    async rate(stars: number) {
        if (this.saving) return;
        this.picked = stars;
        this.saving = true;
        const ok = await this.ratings.rate(this.data.id, stars);
        this.saving = false;
        if (!ok) {
            this.close();
            return;
        }
        this.done = true;
        setTimeout(() => this.close(), 1200);
    }

    close() {
        this.dialogRef.close();
    }
}
