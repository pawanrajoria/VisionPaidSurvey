import {
    Component,
    inject,
    ViewEncapsulation
} from '@angular/core';
import { SharedModule } from '../../../../shared.module';
import { MatDialog, MatDialogConfig, MatDialogRef } from '@angular/material/dialog';

@Component({
    selector: 'app-tier-award',
    imports: [
        SharedModule,
    ],
    templateUrl: './tier-award.component.html',
    styleUrls: ['./tier-award.component.scss']
})
export class TierAwardComponent {
    levels = ['l1', 'l2', 'l3', 'l4'];
    readonly dialog = inject(MatDialog);
    dialogRef: MatDialogRef<any> | null = null;

    closeLevels() {
        this.dialog.closeAll();
    }

}