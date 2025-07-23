import { Component, Input, OnInit, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MessageService } from './message.service';

@Component({
    selector: 'app-message',
    template: '',
    standalone: true,
})
export class MessageComponent implements OnInit {
    private _snackBar = inject(MatSnackBar);
    constructor(private messageService: MessageService) { }
    ngOnInit(): void {
        this.messageService.getMessage().subscribe(data => {
            switch (data.Type) {
                case "success":
                    this._snackBar.open(data.Message, "SUCCESS", { duration: 1000, panelClass: ['blue-snackbar'] });
                    break;
                case "error":
                    this._snackBar.open(data.Message, "ERROR", { duration: 1000, panelClass: ['red-snackbar'] });
                    break;
                case "warn":
                    this._snackBar.open(data.Message, "WARNING", { duration: 1000, panelClass: ['yellow-snackbar'] });
                    break;
                default:
                    break;
            }

        });
    }
}
