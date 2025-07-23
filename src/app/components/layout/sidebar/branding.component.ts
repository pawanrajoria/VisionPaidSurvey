import { Component } from '@angular/core';

@Component({
  selector: 'app-branding',
  imports: [],
  template: `
    <a href="/" class="logodark">
      <img
        src="./assets/images/logo.png"
        class="align-middle m-2"
        alt="logo"
      />
    </a>
  `
})
export class BrandingComponent {
  // options = this.settings.getOptions();
  // constructor(private settings: CoreService) {}
}
