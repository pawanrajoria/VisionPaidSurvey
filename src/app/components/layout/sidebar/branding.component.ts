import { Component } from '@angular/core';
import { BaseComponent } from '../../../base.component';
import { SharedModule } from '../../../shared.module';

@Component({
  selector: 'app-branding',
  imports: [SharedModule],
  template: `
    <a  [routerLink]="['/', currentLang, 'app', 'earn']" class="logodark">
      <img
        src="./assets/images/logo.png"
        class="align-middle m-2"
        alt="logo"
      />
    </a>
  `
})
export class BrandingComponent extends BaseComponent {
  // options = this.settings.getOptions();
  // constructor(private settings: CoreService) {}

  constructor() {
    super();
  } 
}
