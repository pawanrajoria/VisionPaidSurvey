import { ChangeDetectionStrategy, Component, computed, inject, input } from '@angular/core';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { CoverIcon, renderCoverSvg } from './cover-art';

/**
 * Renders the deterministic SVG cover for a blog post / guide / gift card.
 * The markup comes from renderCoverSvg(), which escapes every piece of text it
 * draws, so trusting it as HTML here is safe. Works in SSR (plain innerHTML).
 */
@Component({
  selector: 'pp-cover-art',
  standalone: true,
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `<div class="pp-cover" role="img" [attr.aria-label]="alt() || title()" [innerHTML]="svg()"></div>`,
  styles: [`
    :host { display: block; width: 100%; height: 100%; background: #0f5345; }
    .pp-cover { width: 100%; height: 100%; }
    :host ::ng-deep .pp-cover > svg { display: block; width: 100%; height: 100%; }
  `],
})
export class CoverArtComponent {
  private readonly sanitizer = inject(DomSanitizer);

  readonly title = input.required<string>();
  readonly category = input<string>('earn');
  readonly seed = input<number>(1);
  readonly eyebrow = input<string | undefined>(undefined);
  readonly icon = input<CoverIcon | undefined>(undefined);
  readonly brand = input<string | undefined>(undefined);
  readonly amount = input<string | undefined>(undefined);
  readonly showTitle = input<boolean>(true);
  readonly alt = input<string>('');

  readonly svg = computed<SafeHtml>(() =>
    this.sanitizer.bypassSecurityTrustHtml(renderCoverSvg({
      title: this.title(),
      category: this.category(),
      seed: this.seed(),
      eyebrow: this.eyebrow(),
      icon: this.icon(),
      brand: this.brand(),
      amount: this.amount(),
      showTitle: this.showTitle(),
    }))
  );
}
