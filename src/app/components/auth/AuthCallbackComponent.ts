import { Component, Inject, OnInit, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  imports: [TranslateModule],
  template: `<p>{{ 'app.common.signingIn' | translate }}</p>`
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
