import { isPlatformBrowser } from '@angular/common';
import { Inject, Injectable, PLATFORM_ID } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class GooglePopupService {
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
}
