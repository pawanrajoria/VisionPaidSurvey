// import { Injectable } from '@angular/core';
// import FingerprintJS from '@fingerprintjs/fingerprintjs';
// import { HttpClient } from '@angular/common/http';

// @Injectable({
//     providedIn: 'root'
// })
// export class BotTrackingService {

//     mouseMoves = 0;
//     clicks = 0;
//     scrolls = 0;

//     constructor(private http: HttpClient) {
//         this.trackBehavior();
//     }

//     async initFingerprint() {
//         const fp = await FingerprintJS.load();
//         const result = await fp.get();

//         const deviceInfo = {
//             fingerprintId: result.visitorId,
//             browser: navigator.userAgent,
//             screen: window.screen.width + "x" + window.screen.height,
//             timezone: Intl.DateTimeFormat().resolvedOptions().timeZone
//         };

//         this.http.post('/api/device', deviceInfo).subscribe();
//     }

//     trackBehavior() {

//         document.addEventListener('mousemove', () => this.mouseMoves++);
//         document.addEventListener('click', () => this.clicks++);
//         document.addEventListener('scroll', () => this.scrolls++);

//         setInterval(() => {

//             const data = {
//                 mouseMoves: this.mouseMoves,
//                 clicks: this.clicks,
//                 scrolls: this.scrolls
//             };

//             this.http.post('/api/behavior', data).subscribe();

//             this.mouseMoves = 0;
//             this.clicks = 0;
//             this.scrolls = 0;

//         }, 10000);

//     }

//     async collectSignals(userId: number) {

//         const fp = await FingerprintJS.load();
//         const result = await fp.get();

//         const payload = {
//             userId: userId,
//             fingerprint: result.visitorId,
//             userAgent: navigator.userAgent,
//             language: navigator.language,
//             timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
//             screen: window.screen.width + "x" + window.screen.height,
//             cores: navigator.hardwareConcurrency
//         };

//         return this.http.post('/api/fraud/check', payload).toPromise();
//     }
// }