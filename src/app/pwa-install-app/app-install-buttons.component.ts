// import { Component, OnInit } from '@angular/core';
// import { PwaInstallService } from './pwa-install.service';
// import { SharedModule } from '../shared.module';
// import { AsyncPipe } from '@angular/common';

// @Component({
//     selector: 'app-install-buttons',
//     templateUrl: './app-install-buttons.component.html',
//     styleUrls: ['./app-install-buttons.component.scss'],
//     imports: [SharedModule, AsyncPipe],
//     standalone: true
// })
// export class AppInstallButtonsComponent implements OnInit {
//     constructor(public pwaService: PwaInstallService) { }

//     ngOnInit() { }

//     async install() {
//         const accepted = await this.pwaService.promptInstall();
//         console.log('Install outcome:', accepted ? 'Accepted ✅' : 'Dismissed ❌');
//     }
// }
