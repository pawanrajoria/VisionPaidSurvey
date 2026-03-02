import { Injectable, inject, PLATFORM_ID } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { environment } from '../environments/environment';

@Injectable({ providedIn: 'root' })
export class VersionCheckService {
  private platformId = inject(PLATFORM_ID);

  check() {
    if (!isPlatformBrowser(this.platformId)) return;

    const storedVersion = localStorage.getItem('app_version');

    if (storedVersion && storedVersion !== environment.appVersion) {
      localStorage.setItem('app_version', environment.appVersion);
      location.reload();
    }

    if (!storedVersion) {
      localStorage.setItem('app_version', environment.appVersion);
    }
  }
}
