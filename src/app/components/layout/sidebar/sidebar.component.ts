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

@Component({
  selector: 'app-sidebar',
  imports: [BrandingComponent, SharedModule],
  templateUrl: './sidebar.component.html'
})
export class SidebarComponent implements OnInit {
  constructor() { }
  @Input() showToggle = true;
  @Output() toggleMobileNav = new EventEmitter<void>();
  @Output() toggleCollapsed = new EventEmitter<void>();

  readonly dialog = inject(MatDialog);

  ngOnInit(): void { }


  openTranslate() {
    this.dialog.open(TranslateComponent);
  }
}
