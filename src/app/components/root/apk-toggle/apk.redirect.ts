import { Component, Inject, OnInit, PLATFORM_ID, Optional, REQUEST } from '@angular/core';
import { isPlatformBrowser, isPlatformServer } from '@angular/common';

@Component({
  selector: 'app-redirect',
  template: `<p>Redirecting to store...</p>`
})
export class RedirectComponent implements OnInit {

  private androidUrl = 'https://play.google.com/store/apps/details?id=com.cralpkresearch.profitpiller';
  private iosUrl = 'https://apps.apple.com/app/com.cralpkresearch.profitpiller';

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Optional() @Inject(REQUEST) private request: any
  ) { }

  ngOnInit() {
    let userAgent = '';

    // ✅ SERVER SIDE (SSR)
    if (isPlatformServer(this.platformId)) {
      userAgent = this.request?.headers['user-agent'] || '';
      this.handleRedirect(userAgent);
    }

    // ✅ BROWSER SIDE FALLBACK
    if (isPlatformBrowser(this.platformId)) {
      userAgent = navigator.userAgent || '';
      this.handleRedirect(userAgent);
    }
  }

  handleRedirect(ua: string) {

    ua = ua.toLowerCase();

    if (ua.includes('android')) {
      this.redirect(this.androidUrl);
      return;
    }

    if (ua.includes('iphone') || ua.includes('ipad') || ua.includes('ipod')) {
      this.redirect(this.iosUrl);
      return;
    }

    // Desktop fallback
    this.redirect('/'); // or show QR page
  }

  redirect(url: string) {
    if (!isPlatformBrowser(this.platformId)) return;

    window.location.href = url;
  }
}
