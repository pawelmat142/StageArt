import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { MenuItem, MenuItemCommandEvent } from 'primeng/api';
import { MenuButtonItem } from '../../nav/nav.service';
import { MenuService } from '../../nav/menu-service';

@Component({
  selector: 'app-menu-items',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './menu-items.component.html',
  styleUrl: './menu-items.component.scss'
})
export class MenuItemsComponent {

  constructor(
    private readonly menuService: MenuService,
  ) {}

  @Input() items: MenuButtonItem[] = []

  @Output() select = new EventEmitter<void>()

  _command(item: MenuItem) {
    this.select.emit()
    this.deactivate(this.items)
    item.styleClass = 'active'
    this.menuService.command(item)
  }

  private deactivate(items: MenuItem) {
    this.items.forEach(item => {
      item.styleClass = ''
      if (item.items) {
        this.deactivate(items)
      }
    })
  }
  
}
