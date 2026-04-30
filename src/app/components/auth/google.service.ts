import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GoogleService {
  private readonly clientId =
    '988754056043-d8vthsu4cl5a5ieb4udssagp5076t6ht.apps.googleusercontent.com';

  private isBrowser: boolean;

  constructor(@Inject(PLATFORM_ID) platformId: Object) {
    this.isBrowser = isPlatformBrowser(platformId);
  }

  /**
   * Opens Google OAuth popup and resolves with the access token
   */
  loginWithGooglePopup(): Promise<string> {
    if (!this.isBrowser) {
      return Promise.reject('Google login is only available in the browser');
    }

    const redirectUri = window.location.origin + '/auth/callback';
    const googleAuthUrl =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      `?client_id=${this.clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      '&response_type=token' +
      '&scope=' + encodeURIComponent('openid email profile') +
      '&prompt=select_account';

    const popup = window.open(
      googleAuthUrl,
      'googleLogin',
      'width=500,height=600,top=100,left=200'
    );

    if (!popup) {
      return Promise.reject('Popup blocked! Please allow popups and try again.');
    }

    // Focus popup
    popup.focus();

    return new Promise<string>((resolve, reject) => {
      const handleMessage = (event: MessageEvent) => {
        if (event.data?.token) {
          cleanup();
          resolve(event.data.token);
          popup.close();
        }
      };

      const cleanup = () => {
        window.removeEventListener('message', handleMessage);
        clearInterval(checkClosedInterval);
      };

      window.addEventListener('message', handleMessage);

      const checkClosedInterval = setInterval(() => {
        if (popup.closed) {
          cleanup();
          reject('Popup closed before authentication');
        }
      }, 400);
    });
  }

  loginWithGoogleTab(openInNewTab: boolean = true): Promise<string> {
    if (!this.isBrowser) return Promise.reject('Not in browser');

    // Detect if running as an iOS PWA
    const isStandalone = (window.navigator as any).standalone || window.matchMedia('(display-mode: standalone)').matches;
    const redirectUri = window.location.origin + '/auth/callback';

    const googleAuthUrl =
      'https://accounts.google.com/o/oauth2/v2/auth' +
      `?client_id=${this.clientId}` +
      `&redirect_uri=${encodeURIComponent(redirectUri)}` +
      `&response_type=token` +
      `&scope=` + encodeURIComponent('openid email profile') +
      `&prompt=select_account`;

    if (isStandalone) {
      // iOS PWA: Redirect the current window instead of opening a tab
      window.location.href = googleAuthUrl;
      return new Promise(() => { }); // Execution stops as page redirects
    }

    // Standard Browser: Use your existing Tab/Popup logic
    const popup = openInNewTab
      ? window.open(googleAuthUrl, '_blank')
      : window.open(googleAuthUrl, 'googleLogin', 'width=500,height=600');

    if (!popup) return Promise.reject('Popup blocked!');

    return new Promise((resolve) => {
      const listener = (event: MessageEvent) => {
        if (event.data?.token) {
          resolve(event.data.token);
          window.removeEventListener('message', listener);
        }
      };
      window.addEventListener('message', listener);
    });
  }
}
