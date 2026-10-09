import {
  Component,
  HostBinding,
  Input,
  OnChanges,
  Output,
  EventEmitter,
} from '@angular/core';
import { NavItem } from './nav-item';
import { Router } from '@angular/router';

import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '../../../../shared.module';
import { NavService } from './nav.service';
import { AuthService } from '../../../auth/auth.service';
import { BaseComponent } from '../../../../base.component';

@Component({
  selector: 'app-nav-item',
  imports: [TranslateModule, SharedModule],
  templateUrl: './nav-item.component.html',
  styleUrls: []
})
export class AppNavItemComponent extends BaseComponent implements OnChanges {
  @Output() notify: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input() item: NavItem | any;

  expanded: any = false;

  @HostBinding('attr.aria-expanded') ariaExpanded = this.expanded;
  @Input() depth: any;

  constructor(public navService: NavService, public router: Router) { super(); }

  async ngOnInit() {

  }


  ngOnChanges() {
    // A group such as "More" stays collapsed until the visitor opens it, or one of its own
    // pages is the page being shown. Matching the group's route as a prefix kept it open on
    // every page.
    const url = (this.navService.currentUrl() ?? '').split('?')[0];
    const children: NavItem[] = this.item?.children ?? [];
    if (children.length && url) {
      this.expanded = children.some(child => !!child.route && (url === `/${child.route}` || url.endsWith(`/${child.route}`)));
      this.ariaExpanded = this.expanded;
    }
  }

  onItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      this.router.navigate([item.route]);
    }
    if (item.children && item.children.length) {
      this.expanded = !this.expanded;
    }

    if (this.win) {
      this.win.scroll({
        top: 0,
        left: 0,
        behavior: 'smooth',
      });
      if (!this.expanded) {
        if (this.win.innerWidth < 1024) {
          this.notify.emit();
        }
      }
    }
  }

  openExternalLink(url: string): void {
    if (url && this.win) {
      this.win.open(url, '_blank');
    }
  }

  onSubItemSelected(item: NavItem) {
    if (!item.children || !item.children.length) {
      if (this.expanded && this.win && this.win.innerWidth < 1024) {
        this.notify.emit();
      }
    }
  }
}
