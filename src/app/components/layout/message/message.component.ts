import { Component, Input, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from './message.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
    selector: 'app-message',
    template: '',
    standalone: true,
})
export class MessageComponent implements OnInit {
    private _snackBar = inject(MatSnackBar);
    private translate = inject(TranslateService);
    constructor(private messageService: MessageService) { }
    ngOnInit(): void {
        this.messageService.getMessage().subscribe(data => {
            switch (data.Type) {
                case "success":
                    this._snackBar.open(data.Message, this.translate.instant('app.toast.success'), { duration: 3500, panelClass: ['blue-snackbar'] });
                    break;
                case "error":
                    this._snackBar.open(data.Message, this.translate.instant('app.toast.error'), { duration: 3500, panelClass: ['red-snackbar'] });
                    break;
                case "warn":
                case "warning":
                    this._snackBar.open(data.Message, this.translate.instant('app.toast.warning'), { duration: 3500, panelClass: ['yellow-snackbar'] });
                    break;
                default:
                    break;
            }

        });
    }
}
