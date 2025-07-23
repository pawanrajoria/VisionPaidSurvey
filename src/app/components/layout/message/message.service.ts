import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { MessageVM } from './message.vm';

@Injectable({
    providedIn: 'root'
})
export class MessageService {
    private messages = new Subject<MessageVM>();

    constructor() {
    }
    
    getMessage(): Observable<MessageVM> {
        return this.messages.asObservable();
    }
    showMessage(msg: MessageVM): void {
        this.messages.next(msg);
    }
}
