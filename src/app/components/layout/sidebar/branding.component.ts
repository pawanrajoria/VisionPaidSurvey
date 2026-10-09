import { Component } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { SharedModule } from '../../../shared.module';

@Component({
  selector: 'app-branding',
  imports: [SharedModule],
  template: `
    <a  [routerLink]="['/', currentLocale, 'app', 'earn']" class="logodark">
      <img
        src="./assets/images/homepagelogo.png"
        class="brand-logo"
        alt="Profitpiller"
      />
    </a>
  `,
  styles: [`
    /* The image has a wide transparent border, so it is drawn larger and pulled in with negative margins. */
    .brand-logo { display: block; height: 60px; width: auto; max-width: 100%; margin: -10px 0 -10px -10px; object-fit: contain; }
  `]
})
export class BrandingComponent extends BaseComponent {
  // options = this.settings.getOptions();
  // constructor(private settings: CoreService) {}

  constructor() {
    super();
  } 
}
