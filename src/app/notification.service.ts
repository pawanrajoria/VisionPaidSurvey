import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { ConfigService } from './config.service';
import { LocalStorageService } from './localstorage.service';
import { BrowserService } from './browser.service';
import { BACKGROUND } from './components/home/engagement/engagement.service';

/** An announcement sent from the admin console, as the bell lists it. */
export interface INotificationItem {
  id: number;
  title: string;
  body: string;
  url?: string | null;
  createdAt: string;
}

export type PushPermission = 'unsupported' | 'default' | 'granted' | 'denied';

const VAPID_KEY = 'BDWpctH-dum6PQG-daP1hw6qtS8NNkHX8aPD66h0-Op1ywMZWRqMwaAZhWUGyqQ-IS3XZGhNYnggtSRfn8W15B8';
const TOKEN_KEY = 'last_fcm_token';
const SEEN_KEY = 'notification_seen_id';
/** UserNotificationToken.PlatformTypeId of the website (1 = Android app, 3 = iOS app). */
const WEB_PLATFORM = 2;

/**
 * Website push (Firebase Cloud Messaging) and the announcement list behind the header bell.
 * Firebase messaging is loaded on demand: it only works in a browser and is not needed to render.
 */
@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private http = inject(HttpClient);
  private config = inject(ConfigService);
  private localStorageService = inject(LocalStorageService);
  private browser = inject(BrowserService);

  /** A push that arrived while the site is open. */
  currentMessage = new BehaviorSubject<any>(null);
  /** Drives the "enable notifications" card. */
  permission$ = new BehaviorSubject<PushPermission>('unsupported');

  private listening = false;

  constructor() {
    this.permission$.next(this.readPermission());
  }

  private readPermission(): PushPermission {
    if (!this.browser.isPlatformBrowser) return 'unsupported';
    if (typeof Notification === 'undefined' || !('serviceWorker' in navigator) || !('PushManager' in window)) return 'unsupported';
    return Notification.permission as PushPermission;
  }

  private async messaging() {
    const { getMessaging, isSupported } = await import('firebase/messaging');
    if (!(await isSupported())) return null;
    const { getApp, getApps } = await import('firebase/app');
    return getApps().length ? getMessaging(getApp()) : null;
  }

  /**
   * Asks the browser for permission and registers this browser for push.
   * Must be called from a click - browsers ignore permission requests that are not.
   */
  async enable(): Promise<PushPermission> {
    if (this.readPermission() === 'unsupported') return 'unsupported';
    try {
      const result = await Notification.requestPermission();
      this.permission$.next(result as PushPermission);
      if (result === 'granted') {
        await this.syncToken();
        this.listenForMessages();
      }
      return result as PushPermission;
    } catch {
      return this.readPermission();
    }
  }

  /** Keeps the saved push token fresh. Never prompts: it only acts when permission was already given. */
  async registerNotificationToken(_userEmail?: string) {
    this.permission$.next(this.readPermission());
    if (this.readPermission() === 'granted') await this.syncToken();
  }

  private async syncToken() {
    try {
      const messaging = await this.messaging();
      if (!messaging) return;
      const { getToken } = await import('firebase/messaging');
      const registration = await navigator.serviceWorker.register('/firebase-messaging-sw.js');
      const token = await getToken(messaging, { vapidKey: VAPID_KEY, serviceWorkerRegistration: registration });
      if (!token) return;

      if (token !== this.localStorageService.getItem(TOKEN_KEY)) {
        await firstValueFrom(this.http.post<any>(this.config.baseUrl + "account/save-user-token",
          { token: token, plateform: WEB_PLATFORM }, BACKGROUND));
        this.localStorageService.setItem(TOKEN_KEY, token);
      }
    } catch {
      // Push is a nice-to-have: a blocked service worker or an offline browser must not break the page.
    }
  }

  async listenForMessages() {
    if (this.listening || this.readPermission() !== 'granted') return;
    this.listening = true;
    try {
      const messaging = await this.messaging();
      if (!messaging) return;
      const { onMessage } = await import('firebase/messaging');
      onMessage(messaging, (payload) => this.currentMessage.next(payload));
    } catch {
      this.listening = false;
    }
  }

  /** Announcements of the last 30 days for this account, newest first. */
  async getNotifications(): Promise<INotificationItem[]> {
    try {
      return (await firstValueFrom(this.http.get<INotificationItem[]>(this.config.baseUrl + "notification/list", BACKGROUND))) ?? [];
    } catch {
      return [];
    }
  }

  /** The newest announcement the user has already cleared from the bell. */
  get seenId(): number {
    return Number(this.localStorageService.getItem(SEEN_KEY) ?? 0) || 0;
  }

  markSeen(id: number) {
    if (id > this.seenId) this.localStorageService.setItem(SEEN_KEY, String(id));
  }
}
