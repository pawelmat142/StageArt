import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MenuService } from '../../nav/menu-service';
import { ButtonModule } from 'primeng/button';
import { SidebarModule } from 'primeng/sidebar';
import { PanelMenuService } from '../../../profile/view/sidebar/panel-menu.service';
import { MenuItemsComponent } from '../menu-items/menu-items.component';
import { ProfileDataComponent } from '../profile-data/profile-data.component';
import { combineLatest, map, tap } from 'rxjs';
import { NavService } from '../../nav/nav.service';
import { Path } from '../../nav/path';
import { $desktop } from '../../tools/media-query';

@Component({
  selector: 'app-mobile-btn',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    SidebarModule,
    MenuItemsComponent,
    ProfileDataComponent
  ],
  templateUrl: './mobile-btn.component.html',
  styleUrl: './mobile-btn.component.scss',
})
export class MobileBtnComponent {

  constructor(
    readonly menu: MenuService,
    private readonly panelMenuService: PanelMenuService,
    private readonly nav: NavService
  ) {
  }

  sidebarVisible: boolean = false

  _mobileMenuItems$ = combineLatest([
    this.menu.menuBtns$,
    this.panelMenuService._items$
  ]).pipe(
    map(([menu, panelMenu]) => {
    const _menu = { 
      label: 'Menu',
      items: menu
    }
    if (this.nav.path.includes(Path.PANEL)) {
      panelMenu.unshift(_menu)
      return panelMenu
    }
    return [_menu]
  }),
)
  
  _open() {
    this.sidebarVisible = true
  }

  _close() {
    this.sidebarVisible = false
  }

}
