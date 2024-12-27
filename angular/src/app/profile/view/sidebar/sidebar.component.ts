import { Component } from '@angular/core';
import { Store } from '@ngrx/store';
import { profile } from '../../profile.state';
import { AppState } from '../../../app.state';
import { CommonModule } from '@angular/common';
import { MenuModule } from 'primeng/menu';
import { PanelMenuService } from './panel-menu.service';
import { MenuItemsComponent } from '../../../global/components/menu-items/menu-items.component';
import { ProfileDataComponent } from '../../../global/components/profile-data/profile-data.component';

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [
    CommonModule,
    MenuModule,
    MenuItemsComponent,
    ProfileDataComponent
],
  templateUrl: './sidebar.component.html',
  styleUrl: './sidebar.component.scss',
})
export class SidebarComponent {

  constructor(
    private readonly panelMenuService: PanelMenuService,
  ) {}

  _items$ = this.panelMenuService._items$

}
