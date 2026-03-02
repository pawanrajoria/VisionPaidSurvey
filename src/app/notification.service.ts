import { inject, Injectable } from '@angular/core';
// import {  getToken, onMessage } from '@angular/fire/messaging';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';
import { ConfigService } from './config.service';
import { LocalStorageService } from './localstorage.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private localStorageService = inject(LocalStorageService);
  // private messaging = inject(Messaging);
  currentMessage = new BehaviorSubject<any>(null);

  async registerNotificationToken(userEmail: string) {
    // try {
    //   const token = await getToken(this.messaging, {
    //     vapidKey: 'BDWpctH-dum6PQG-daP1hw6qtS8NNkHX8aPD66h0-Op1ywMZWRqMwaAZhWUGyqQ-IS3XZGhNYnggtSRfn8W15B8'
    //   });

    //   if (token) {
    //     const savedToken = this.localStorageService.getItem('last_fcm_token');

    //     if (token !== savedToken) {
    //       const tokenInfo = await this.http.post<any>(this.config.baseUrl + "account/save-user-token", { token: token, plateform: 2 }).toPromise();
    //       this.localStorageService.setItem('last_fcm_token', token);
    //     } else {
    //       // console.log('Token already synced, skipping API call.');
    //     }
    //   }
    // } catch (err) {
    //   // console.error('Permission denied or error', err);
    // }
  }


  listenForMessages() {
    // onMessage(this.messaging, (payload) => {
    //   // console.log('Message received in foreground: ', payload);
    //   this.currentMessage.next(payload);
    // });
  }
}
