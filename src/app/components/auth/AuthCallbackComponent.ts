import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  template: `<p>Signing in...</p>`
})
export class AuthCallbackComponent implements OnInit {

  constructor(@Inject(PLATFORM_ID) private platformId: Object) {}

  ngOnInit(): void {
    if (!isPlatformBrowser(this.platformId)) return;

    const params = new URLSearchParams(window.location.hash.substring(1));
    const token = params.get('access_token');

    if (token && window.opener) {
      window.opener.postMessage({ token }, window.origin);
    }

    window.close();
  }
}
