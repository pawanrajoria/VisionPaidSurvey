import { inject, Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MessageVM } from './message.vm';
import { MatDialog } from '@angular/material/dialog';
import { PremiumUserAlertComponent } from '../../premium-user-alert/premium-user-alert';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private messages = new Subject<MessageVM>();
    private dialog = inject(MatDialog);
    constructor() {
    }

    getMessage(): Observable<MessageVM> {
        return this.messages.asObservable();
    }
    showMessage(msg: MessageVM): void {
        this.messages.next(msg);
    }

    showPremiumUserComponent() {
        this.dialog.open(PremiumUserAlertComponent, {
            width: '420px',
            height: 'auto', // Keep it auto!
            maxWidth: '95vw'
        });
    }
}
