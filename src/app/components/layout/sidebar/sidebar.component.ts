import {
  Component,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { BrandingComponent } from './branding.component';
import { TablerIconsModule } from 'angular-tabler-icons';
import { SharedModule } from '../../../shared.module';
import { TranslateComponent } from '../translator/translator.component';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-sidebar',
  imports: [BrandingComponent, SharedModule],
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  constructor() { }
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  readonly dialog = inject(MatDialog);
  private readonly translate = inject(TranslateService);

  /** "EN", "HI", ... - the language the site is shown in. */
  get langCode(): string {
    return (this.translate.currentLang || this.translate.getDefaultLang() || 'en').split('-')[0].toUpperCase();
  }

  ngOnInit(): void { }


  openTranslate() {
    this.dialog.open(TranslateComponent);
  }
}
